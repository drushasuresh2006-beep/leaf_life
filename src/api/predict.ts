import { PLANT_DISEASE_DICTIONARY } from '../data/diseases';
import { AppMode, CareAnswers, PlantId, PredictionResult } from '../types/leafcheck';

// Switch to true to use the offline simulated mock instead of the Gemini API backend.
export const USE_MOCK = false;

let mockCallCounter = 0;

function createScanId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getFileSignature(image: File | Blob | string): string {
  if (typeof image === 'string') return image.toLowerCase();
  if ('name' in image && typeof image.name === 'string') {
    return `${image.name.toLowerCase()}_${image.size}`;
  }
  return `blob_${image.size}`;
}

async function runMockPredict(
  image: File | Blob | string,
  plant: PlantId,
  mode: AppMode
): Promise<PredictionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  mockCallCounter += 1;
  const entries = PLANT_DISEASE_DICTIONARY[plant] ?? PLANT_DISEASE_DICTIONARY.tomato;
  const signature = getFileSignature(image);

  const isSpottedSample = signature.includes('sample_leaf_spotted');
  const isHealthySample = signature.includes('sample_leaf_healthy');
  const scenarioRoll = (mockCallCounter + signature.length) % 7;

  if (!isSpottedSample && !isHealthySample && scenarioRoll === 5) {
    return {
      id: createScanId(),
      plant,
      mode,
      label: 'Not sure',
      confidence: 24,
      alternatives: [],
      isNotLeaf: true,
      plantMatchesSelection: true,
      reason: 'The image does not appear to focus clearly on a single plant leaf.',
      adviceKey: 'not_sure',
      createdAt: new Date().toISOString(),
    };
  }

  if (!isSpottedSample && !isHealthySample && scenarioRoll === 3) {
    return {
      id: createScanId(),
      plant,
      mode,
      label: 'Not sure',
      confidence: 39,
      alternatives: [],
      isNotLeaf: false,
      plantMatchesSelection: true,
      reason: 'Lighting or focus makes leaf markings too uncertain for a reliable match.',
      adviceKey: 'not_sure',
      createdAt: new Date().toISOString(),
    };
  }

  let primaryIndex = 0;
  let confidence = 84;

  if (isHealthySample) {
    primaryIndex = entries.findIndex((item) => item.adviceKey === 'healthy');
    if (primaryIndex < 0) primaryIndex = entries.length - 1;
    confidence = 91;
  } else if (isSpottedSample) {
    primaryIndex = 0;
    confidence = 86;
  } else {
    primaryIndex = (mockCallCounter + signature.length) % entries.length;
    const isHigh = scenarioRoll % 2 === 0;
    confidence = isHigh ? 81 + ((mockCallCounter * 3) % 13) : 58 + ((mockCallCounter * 5) % 19);
  }

  const primary = entries[primaryIndex];
  const remaining = entries.filter((_, idx) => idx !== primaryIndex);
  const remainderBudget = Math.max(3, 100 - confidence);
  const alt1Conf = Math.max(1, Math.round(remainderBudget * 0.55));
  const alt2Conf = Math.max(1, Math.round(remainderBudget * 0.3));
  const alt3Conf = Math.max(1, remainderBudget - alt1Conf - alt2Conf);
  const confidences = [alt1Conf, alt2Conf, alt3Conf];

  const alternatives = remaining.slice(0, 3).map((entry, idx) => ({
    label: entry.label,
    confidence: confidences[idx] ?? 1,
  }));

  return {
    id: createScanId(),
    plant,
    mode,
    label: primary.label,
    confidence,
    alternatives,
    isNotLeaf: false,
    plantMatchesSelection: true,
    reason:
      primary.adviceKey === 'healthy'
        ? 'Leaf surface shows uniform green colour without noticeable spots or lesions.'
        : 'Visible spots and colour variation on the leaf blade align with this pattern.',
    adviceKey: primary.adviceKey,
    createdAt: new Date().toISOString(),
  };
}

async function imageInputToBase64(
  image: File | Blob | string
): Promise<{ imageBase64: string; mimeType: string }> {
  let blob: Blob;

  if (typeof image === 'string') {
    const fetched = await fetch(image);
    if (!fetched.ok) {
      throw new Error('Could not load the selected sample image.');
    }
    blob = await fetched.blob();
  } else {
    blob = image;
  }

  const mimeType = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/jpeg';

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image data.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(blob);
  });

  const commaIndex = dataUrl.indexOf(',');
  const imageBase64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
  if (!imageBase64) {
    throw new Error('Selected image appears to be empty.');
  }

  return { imageBase64, mimeType };
}

function validateClientPredictionResponse(raw: unknown): PredictionResult {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid screening response received from server.');
  }
  const obj = raw as Record<string, unknown>;
  if (
    typeof obj.id !== 'string' ||
    typeof obj.plant !== 'string' ||
    (obj.mode !== 'home' && obj.mode !== 'field') ||
    typeof obj.label !== 'string' ||
    typeof obj.confidence !== 'number' ||
    !Number.isFinite(obj.confidence) ||
    !Array.isArray(obj.alternatives) ||
    typeof obj.isNotLeaf !== 'boolean' ||
    typeof obj.adviceKey !== 'string' ||
    typeof obj.createdAt !== 'string'
  ) {
    throw new Error('Screening response was missing required fields.');
  }
  return obj as unknown as PredictionResult;
}

export async function predictLeaf(
  image: File | Blob | string,
  plant: PlantId,
  mode: AppMode,
  careAnswers?: CareAnswers
): Promise<PredictionResult> {
  if (USE_MOCK) {
    return runMockPredict(image, plant, mode);
  }

  const { imageBase64, mimeType } = await imageInputToBase64(image);

  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      mimeType,
      plant,
      mode,
      careAnswers,
    }),
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Received an unreadable response from the server. Please retry.');
  }

  if (!response.ok) {
    const errMsg =
      payload &&
      typeof payload === 'object' &&
      typeof (payload as Record<string, unknown>).error === 'string'
        ? ((payload as Record<string, unknown>).error as string)
        : 'Leaf analysis failed. Please try again.';
    throw new Error(errMsg);
  }

  return validateClientPredictionResponse(payload);
}
