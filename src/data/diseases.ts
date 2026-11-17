import { PlantId } from '../types/leafcheck';

export interface DiseaseEntry {
  label: string;
  adviceKey: string;
}

export const PLANT_DISEASE_DICTIONARY: Record<PlantId, DiseaseEntry[]> = {
  tomato: [
    { label: 'Early blight', adviceKey: 'early_blight' },
    { label: 'Late blight', adviceKey: 'late_blight' },
    { label: 'Leaf mold', adviceKey: 'leaf_mold' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  chilli: [
    { label: 'Leaf curl', adviceKey: 'leaf_curl' },
    { label: 'Bacterial spot', adviceKey: 'bacterial_spot' },
    { label: 'Powdery mildew', adviceKey: 'powdery_mildew' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  brinjal: [
    { label: 'Cercospora leaf spot', adviceKey: 'cercospora_spot' },
    { label: 'Little leaf stress', adviceKey: 'little_leaf' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  rose: [
    { label: 'Black spot', adviceKey: 'black_spot' },
    { label: 'Powdery mildew', adviceKey: 'powdery_mildew' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  hibiscus: [
    { label: 'Leaf spot', adviceKey: 'leaf_spot' },
    { label: 'Leaf yellowing (chlorosis)', adviceKey: 'chlorosis' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  tulsi: [
    { label: 'Downy mildew', adviceKey: 'downy_mildew' },
    { label: 'Leaf spot', adviceKey: 'leaf_spot' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  curry_leaf: [
    { label: 'Leaf spot', adviceKey: 'leaf_spot' },
    { label: 'Sooty mold', adviceKey: 'sooty_mold' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  money_plant: [
    { label: 'Root stress leaf spot', adviceKey: 'root_stress_spot' },
    { label: 'Bacterial leaf blight', adviceKey: 'bacterial_blight' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  potato: [
    { label: 'Early blight', adviceKey: 'early_blight' },
    { label: 'Late blight', adviceKey: 'late_blight' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  maize: [
    { label: 'Northern leaf blight', adviceKey: 'northern_blight' },
    { label: 'Common rust', adviceKey: 'common_rust' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  rice: [
    { label: 'Brown spot', adviceKey: 'brown_spot' },
    { label: 'Leaf blast', adviceKey: 'leaf_blast' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
  grape: [
    { label: 'Downy mildew', adviceKey: 'downy_mildew' },
    { label: 'Powdery mildew', adviceKey: 'powdery_mildew' },
    { label: 'Healthy', adviceKey: 'healthy' },
  ],
};

export function getAllowedLabelsForPlant(plant: PlantId): string[] {
  const entries = PLANT_DISEASE_DICTIONARY[plant] ?? PLANT_DISEASE_DICTIONARY.tomato;
  return entries.map((entry) => entry.label);
}

export function getAdviceKeyForLabel(plant: PlantId, label: string): string {
  const entries = PLANT_DISEASE_DICTIONARY[plant] ?? PLANT_DISEASE_DICTIONARY.tomato;
  const match = entries.find((entry) => entry.label.toLowerCase() === label.toLowerCase());
  if (match) return match.adviceKey;
  if (label.toLowerCase() === 'healthy') return 'healthy';
  return 'not_sure';
}
