export type AppMode = 'home' | 'field';

export type PlantId =
  | 'tomato'
  | 'chilli'
  | 'brinjal'
  | 'rose'
  | 'hibiscus'
  | 'tulsi'
  | 'curry_leaf'
  | 'money_plant'
  | 'potato'
  | 'maize'
  | 'rice'
  | 'grape';

export type WateringFrequency =
  | 'daily'
  | 'every_2_3_days'
  | 'weekly'
  | 'when_soil_dry';

export type SunlightLevel = 'low' | 'medium' | 'bright';

export type PotDrainage = 'yes' | 'no' | 'not_sure';

export type LastFertilised = 'never' | 'recently' | 'long_ago';

export interface CareAnswers {
  wateringFrequency: WateringFrequency;
  sunlight: SunlightLevel;
  potDrainage: PotDrainage;
  lastFertilised: LastFertilised;
}

export interface AlternativePrediction {
  label: string;
  confidence: number;
}

export interface PredictionResult {
  id: string;
  plant: PlantId;
  mode: AppMode;
  label: string;
  confidence: number;
  alternatives: AlternativePrediction[];
  isNotLeaf: boolean;
  plantMatchesSelection?: boolean;
  reason?: string;
  adviceKey: string;
  createdAt: string;
}

export interface SavedScan extends PredictionResult {
  thumbnailDataUrl?: string;
  careAnswers?: CareAnswers;
  helpful?: boolean | null;
  savedAt: string;
}

export type RoutePage = 'home' | 'scan' | 'care' | 'result' | 'history' | 'about';

export type LanguageCode = 'en' | 'hi';

export type ConfidenceTier = 'high' | 'medium' | 'low';
