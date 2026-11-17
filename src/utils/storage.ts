import { ConfidenceTier, LanguageCode, SavedScan } from '../types/leafcheck';

const HISTORY_STORAGE_KEY = 'leafcheck_scan_history_v1';
const LANGUAGE_STORAGE_KEY = 'leafcheck_language_v1';

export function getConfidenceTier(confidence: number): ConfidenceTier {
  if (confidence >= 80) return 'high';
  if (confidence >= 50) return 'medium';
  return 'low';
}

export function loadScanHistory(): { scans: SavedScan[]; storageAvailable: boolean } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { scans: [], storageAvailable: false };
    }
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return { scans: [], storageAvailable: true };
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { scans: [], storageAvailable: true };
    }
    const validScans = parsed.filter(
      (item): item is SavedScan =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.plant === 'string' &&
        typeof item.confidence === 'number'
    );
    return { scans: validScans, storageAvailable: true };
  } catch {
    return { scans: [], storageAvailable: false };
  }
}

export function saveScanHistory(scans: SavedScan[]): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(scans));
    return true;
  } catch {
    return false;
  }
}

export function loadSavedLanguage(): LanguageCode {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'en';
    }
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(lang: LanguageCode): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  } catch {
    // Ignore storage unavailability
  }
}

export async function createThumbnailDataUrl(sourceUrl: string): Promise<string | undefined> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = sourceUrl;
    });

    const maxSize = 260;
    const scale = Math.min(1, maxSize / Math.max(img.width || 1, img.height || 1));
    const width = Math.max(1, Math.round((img.width || maxSize) * scale));
    const height = Math.max(1, Math.round((img.height || maxSize) * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.72);
  } catch {
    return undefined;
  }
}
