import { AppMode, PlantId } from '../types/leafcheck';

export interface PlantOption {
  id: PlantId;
  name: string;
  botanicalHint: string;
  modes: AppMode[];
}

export const PLANTS: PlantOption[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    botanicalHint: 'Solanum lycopersicum',
    modes: ['home', 'field'],
  },
  {
    id: 'chilli',
    name: 'Chilli',
    botanicalHint: 'Capsicum annuum',
    modes: ['home'],
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    botanicalHint: 'Solanum melongena',
    modes: ['home'],
  },
  {
    id: 'rose',
    name: 'Rose',
    botanicalHint: 'Rosa spp.',
    modes: ['home'],
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus',
    botanicalHint: 'Hibiscus rosa-sinensis',
    modes: ['home'],
  },
  {
    id: 'tulsi',
    name: 'Tulsi',
    botanicalHint: 'Ocimum tenuiflorum',
    modes: ['home'],
  },
  {
    id: 'curry_leaf',
    name: 'Curry leaf',
    botanicalHint: 'Murraya koenigii',
    modes: ['home'],
  },
  {
    id: 'money_plant',
    name: 'Money plant',
    botanicalHint: 'Epipremnum aureum',
    modes: ['home'],
  },
  {
    id: 'potato',
    name: 'Potato',
    botanicalHint: 'Solanum tuberosum',
    modes: ['field'],
  },
  {
    id: 'maize',
    name: 'Maize',
    botanicalHint: 'Zea mays',
    modes: ['field'],
  },
  {
    id: 'rice',
    name: 'Rice',
    botanicalHint: 'Oryza sativa',
    modes: ['field'],
  },
  {
    id: 'grape',
    name: 'Grape',
    botanicalHint: 'Vitis vinifera',
    modes: ['field'],
  },
];

export function getPlantsForMode(mode: AppMode): PlantOption[] {
  return PLANTS.filter((plant) => plant.modes.includes(mode));
}

export function getPlantName(plantId: PlantId): string {
  return PLANTS.find((plant) => plant.id === plantId)?.name ?? plantId;
}

export interface SampleLeafAsset {
  id: string;
  label: string;
  plantId: PlantId;
  mode: AppMode;
  imageUrl: string;
  description: string;
}

export const SAMPLE_LEAF_ASSETS: SampleLeafAsset[] = [
  {
    id: 'sample-tomato-spots',
    label: 'Tomato leaf with spots',
    plantId: 'tomato',
    mode: 'home',
    imageUrl: '/src/assets/images/sample_leaf_spotted_1794909575826.jpg',
    description: 'Sample single tomato leaf with brown target-like spots on a plain surface.',
  },
  {
    id: 'sample-hibiscus-healthy',
    label: 'Healthy hibiscus leaf',
    plantId: 'hibiscus',
    mode: 'home',
    imageUrl: '/src/assets/images/sample_leaf_healthy_1794909576746.jpg',
    description: 'Sample healthy green hibiscus leaf photographed in soft daylight.',
  },
];

export const HERO_IMAGE_URL = '/src/assets/images/hero_botanical_leaf_1794909575565.jpg';
