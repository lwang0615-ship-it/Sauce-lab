export type SauceStyle =
  | 'Steak & red meat'
  | 'Fillet & delicate cuts'
  | 'Asian fusion'
  | 'Grilled poultry'
  | 'Dipping sauce'
  | 'Marinade base';

export type TargetTexture =
  | 'Glossy jus'
  | 'Demi-glace'
  | 'Thick sauce'
  | 'Emulsified';

export type RDPhase =
  | 'Ingredient Research'
  | 'Formula Development'
  | 'Sensory Testing'
  | 'Stability Testing'
  | 'Final Spec';

export type PhaseState = 'pending' | 'active' | 'done';

export interface FlavorValues {
  sweet: number;
  salty: number;
  sour: number;
  bitter: number;
  umami: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number; // grams
  role: string;
}

export type TextureMechanism = 'Reduction' | 'Emulsification' | 'Starch' | 'Natural gel';
export type StarchType = 'Arrowroot' | 'Cornstarch' | 'Roux' | 'Tapioca';

export interface TextureSettings {
  mechanism: TextureMechanism;
  reductionPercent: number;
  starchType: StarchType;
}

export interface TastingRound {
  id: string;
  round: number;
  date: string;
  scores: {
    aroma: number;
    initialFlavor: number;
    balance: number;
    texturebody: number;
    finishLength: number;
    pairingOnProtein: number;
  };
  notes: string;
}

export interface AppState {
  projectName: string;
  sauceStyle: SauceStyle | '';
  targetTexture: TargetTexture | '';
  developmentNotes: string;
  phases: Record<RDPhase, PhaseState>;
  flavor: FlavorValues;
  ingredients: Ingredient[];
  batchSize: number;
  texture: TextureSettings;
  tastingHistory: TastingRound[];
  darkMode: boolean;
}

export const DEFAULT_PHASES: Record<RDPhase, PhaseState> = {
  'Ingredient Research': 'active',
  'Formula Development': 'pending',
  'Sensory Testing': 'pending',
  'Stability Testing': 'pending',
  'Final Spec': 'pending',
};

export const DEFAULT_FLAVOR: FlavorValues = {
  sweet: 5,
  salty: 4,
  sour: 3,
  bitter: 2,
  umami: 8,
};

export const DEFAULT_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Black garlic purée', amount: 80, role: 'Core flavor' },
  { id: '2', name: 'Veal demi-glace', amount: 200, role: 'Umami base' },
  { id: '3', name: 'Red wine reduced', amount: 100, role: 'Acid' },
  { id: '4', name: 'Shallots', amount: 50, role: 'Aromatic' },
  { id: '5', name: 'Cold butter', amount: 60, role: 'Emulsifier' },
  { id: '6', name: 'Dijon mustard', amount: 10, role: 'Seasoning' },
];

export const DEFAULT_STATE: AppState = {
  projectName: '',
  sauceStyle: '',
  targetTexture: '',
  developmentNotes: '',
  phases: DEFAULT_PHASES,
  flavor: DEFAULT_FLAVOR,
  ingredients: DEFAULT_INGREDIENTS,
  batchSize: 500,
  texture: {
    mechanism: 'Reduction',
    reductionPercent: 40,
    starchType: 'Arrowroot',
  },
  tastingHistory: [],
  darkMode: false,
};
