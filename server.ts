import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  getAdviceKeyForLabel,
  getAllowedLabelsForPlant,
  PLANT_DISEASE_DICTIONARY,
} from './src/data/diseases.ts';
import type {
  AlternativePrediction,
  AppMode,
  CareAnswers,
  PlantId,
  PredictionResult,
} from './src/types/leafcheck.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

const SYSTEM_INSTRUCTION =
  'You are a plant leaf screening assistant. First decide whether the image shows a single plant leaf or plant part. If it does not (a person, object, room, screenshot, etc.), return isLeaf=false. If it does, choose ONLY from the allowed labels provided for the selected plant. Do not invent labels. Never give pesticide names or dosages. If the image is blurry, dark, or you are unsure, use a low confidence.';

interface RawGeminiPrediction {
  isLeaf: boolean;
  plantMatchesSelection: boolean;
  label: string;
  confidence: number;
  alternatives: Array<{ label: string; confidence: number }>;
  reason: string;
}

function isValidPlantId(value: unknown): value is PlantId {
  return typeof value === 'string' && value in PLANT_DISEASE_DICTIONARY;
}

function isValidMode(value: unknown): value is AppMode {
  return value === 'home' || value === 'field';
}

function toPercent(score: number): number {
  const clamped = Math.max(0, Math.min(1, score));
  if (clamped < 0.5) {
    return Math.min(49, Math.round(clamped * 100));
  }
  return Math.max(50, Math.round(clamped * 100));
}

function formatCareContext(careAnswers?: CareAnswers): string {
  if (!careAnswers) {
    return 'No home-care questionnaire answers provided.';
  }
  return [
    `Watering frequency: ${careAnswers.wateringFrequency.replace(/_/g, ' ')}`,
    `Sunlight: ${careAnswers.sunlight}`,
    `Pot drainage: ${careAnswers.potDrainage.replace(/_/g, ' ')}`,
    `Last fertilised: ${careAnswers.lastFertilised.replace(/_/g, ' ')}`,
  ].join('; ');
}

function validateGeminiPayload(
  raw: unknown,
  allowedLabels: string[]
): { valid: true; data: RawGeminiPrediction } | { valid: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Response was not a JSON object.' };
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.isLeaf !== 'boolean') {
    return { valid: false, error: 'Missing boolean isLeaf field.' };
  }
  if (typeof obj.plantMatchesSelection !== 'boolean') {
    return { valid: false, error: 'Missing boolean plantMatchesSelection field.' };
  }
  if (typeof obj.label !== 'string') {
    return { valid: false, error: 'Missing string label field.' };
  }
  if (
    typeof obj.confidence !== 'number' ||
    !Number.isFinite(obj.confidence) ||
    obj.confidence < 0 ||
    obj.confidence > 1
  ) {
    return { valid: false, error: 'Confidence must be a number between 0 and 1.' };
  }
  if (!Array.isArray(obj.alternatives)) {
    return { valid: false, error: 'Missing alternatives array.' };
  }
  if (typeof obj.reason !== 'string' || obj.reason.trim().length === 0) {
    return { valid: false, error: 'Missing reason sentence.' };
  }

  const findAllowedLabel = (candidate: string): string | undefined =>
    allowedLabels.find((allowed) => allowed.toLowerCase() === candidate.trim().toLowerCase());

  const isConfidentLeafMatch =
    obj.isLeaf === true && obj.plantMatchesSelection === true && obj.confidence >= 0.5;

  let normalizedLabel = obj.label.trim();
  if (isConfidentLeafMatch) {
    const matched = findAllowedLabel(normalizedLabel);
    if (!matched) {
      return {
        valid: false,
        error: `Model returned unsupported label "${normalizedLabel}".`,
      };
    }
    normalizedLabel = matched;
  }

  const normalizedAlternatives: Array<{ label: string; confidence: number }> = [];
  for (const item of obj.alternatives) {
    if (!item || typeof item !== 'object') continue;
    const altObj = item as Record<string, unknown>;
    if (typeof altObj.label !== 'string') continue;
    if (
      typeof altObj.confidence !== 'number' ||
      !Number.isFinite(altObj.confidence) ||
      altObj.confidence < 0 ||
      altObj.confidence > 1
    ) {
      continue;
    }
    const matchedAlt = findAllowedLabel(altObj.label);
    if (!matchedAlt) continue;
    if (matchedAlt.toLowerCase() === normalizedLabel.toLowerCase()) continue;
    if (normalizedAlternatives.some((existing) => existing.label === matchedAlt)) continue;

    normalizedAlternatives.push({
      label: matchedAlt,
      confidence: altObj.confidence,
    });

    if (normalizedAlternatives.length >= 3) break;
  }

  return {
    valid: true,
    data: {
      isLeaf: obj.isLeaf,
      plantMatchesSelection: obj.plantMatchesSelection,
      label: normalizedLabel,
      confidence: obj.confidence,
      alternatives: normalizedAlternatives,
      reason: obj.reason.trim(),
    },
  };
}

function createScanId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.post('/api/predict', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'Gemini API key is not configured on the server. Check the Settings > Secrets panel.',
      });
    }

    const { imageBase64, mimeType, plant, mode, careAnswers } = req.body ?? {};

    if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
      return res.status(400).json({ error: 'Please provide an image to analyse.' });
    }
    if (typeof mimeType !== 'string' || !mimeType.startsWith('image/')) {
      return res.status(400).json({ error: 'Uploaded file must be a valid image.' });
    }
    if (!isValidPlantId(plant)) {
      return res.status(400).json({ error: 'Unsupported plant selection.' });
    }
    if (!isValidMode(mode)) {
      return res.status(400).json({ error: 'Invalid growing mode.' });
    }

    const allowedLabels = getAllowedLabelsForPlant(plant);
    const careContext = formatCareContext(careAnswers as CareAnswers | undefined);

    const promptText = [
      `Selected plant: ${plant.replace(/_/g, ' ')}`,
      `Growing mode: ${mode === 'home' ? 'Home / Garden' : 'Field / Farm'}`,
      `Care context: ${careContext}`,
      `Allowed labels for this plant (choose ONLY from this exact list when isLeaf=true and plantMatchesSelection=true): ${JSON.stringify(allowedLabels)}`,
      'Return JSON matching the schema:',
      '- isLeaf: true only if the image clearly shows a plant leaf or plant part; false for people, objects, rooms, screenshots, text, or non-plant photos.',
      '- plantMatchesSelection: true if the leaf appears consistent with the selected plant or cannot be clearly ruled out; false if it clearly belongs to an unrelated plant.',
      '- label: one exact label from the allowed labels list (or "Uncertain" if isLeaf=false, plantMatchesSelection=false, or confidence < 0.5).',
      '- confidence: decimal from 0 to 1 reflecting your certainty (use < 0.5 if blurry, dark, cluttered, or unsure).',
      '- alternatives: up to 3 other allowed labels with their decimal confidence (0 to 1), empty array if isLeaf=false or plantMatchesSelection=false.',
      '- reason: one short sentence explaining the visual cues or photo quality. If isLeaf=false, plantMatchesSelection=false, or confidence < 0.5, do NOT mention any disease name in reason. Never mention pesticide names or dosages.',
    ].join('\n');

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isLeaf: {
                type: Type.BOOLEAN,
                description: 'True if the photo shows a plant leaf or plant part.',
              },
              plantMatchesSelection: {
                type: Type.BOOLEAN,
                description:
                  'True if the leaf appears consistent with the user-selected plant.',
              },
              label: {
                type: Type.STRING,
                description: 'Chosen label from the allowed labels list.',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence score from 0 to 1.',
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                  },
                  required: ['label', 'confidence'],
                },
                description: 'Up to 3 alternative allowed labels with 0-1 confidence.',
              },
              reason: {
                type: Type.STRING,
                description: 'One short sentence explaining the screening observation.',
              },
            },
            required: [
              'isLeaf',
              'plantMatchesSelection',
              'label',
              'confidence',
              'alternatives',
              'reason',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({
          error: 'The AI model returned an empty response. Please try again.',
        });
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(rawText);
      } catch {
        return res.status(502).json({
          error: 'The screening response could not be parsed cleanly. Please try again.',
        });
      }

      const validated = validateGeminiPayload(parsedJson, allowedLabels);
      if (!validated.valid) {
        return res.status(502).json({
          error: 'The screening response did not match the expected format. Please try again.',
        });
      }

      const data = validated.data;
      const isUncertain =
        !data.isLeaf || !data.plantMatchesSelection || data.confidence < 0.5;

      const confidencePercent = toPercent(data.confidence);
      const alternatives: AlternativePrediction[] = isUncertain
        ? []
        : data.alternatives.slice(0, 3).map((alt) => ({
            label: alt.label,
            confidence: Math.max(1, Math.round(alt.confidence * 100)),
          }));

      const result: PredictionResult = {
        id: createScanId(),
        plant,
        mode,
        label: isUncertain ? 'Not sure' : data.label,
        confidence: confidencePercent,
        alternatives,
        isNotLeaf: !data.isLeaf,
        plantMatchesSelection: data.plantMatchesSelection,
        reason: data.reason,
        adviceKey: isUncertain ? 'not_sure' : getAdviceKeyForLabel(plant, data.label),
        createdAt: new Date().toISOString(),
      };

      return res.json(result);
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const message = typeof errObj?.message === 'string' ? errObj.message : '';
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;

      if (status === 429 || message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
        return res.status(429).json({
          error:
            'The screening service is temporarily rate-limited. Please wait a few seconds and retry.',
        });
      }

      if (
        status === 403 ||
        message.includes('PERMISSION_DENIED') ||
        message.includes('API_KEY_INVALID')
      ) {
        return res.status(403).json({
          error:
            'The Gemini API key could not be verified. Please check Settings > Secrets.',
        });
      }

      return res.status(502).json({
        error: 'Unable to analyse the leaf image right now. Please check your connection and retry.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('App build not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LeafCheck server listening on http://localhost:${PORT}`);
  });
}

startServer();
