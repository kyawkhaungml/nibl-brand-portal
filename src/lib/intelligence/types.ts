export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO
};

export type FoodCategory =
  | 'Japanese'
  | 'Salads'
  | 'Asian'
  | 'American'
  | 'Spicy'
  | 'Mexican';

export type FlavorName =
  | 'Yuzu'
  | 'Yuzu Mint'
  | 'Hibiscus Lime'
  | 'Yuzu Ginger'
  | 'Cold Brew Tonic';

export type AffinityMatrix = Record<FlavorName, Record<FoodCategory, number>>;

export type ProductPrediction = {
  predictedScanRate: number;
  predictedRating: number;
  predictedBuyAgain: number;
  icpFitScore: number;
  analysis: string;
  bestFoodPairing: string;
  bestFoodAffinityScore: number;
  riskFlag: string | null;
};

export type PredictRequest = {
  flavorDescription: string;
  targetFoods: string[];
};

export type ChatRequest = {
  message: string;
  history: ChatMessage[];
};
