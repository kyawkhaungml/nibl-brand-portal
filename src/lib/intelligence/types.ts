export type ChatRole = 'user' | 'assistant';

export type Comparison = {
  leftLabel: string;
  leftPct: number;       // 0-100
  rightLabel: string;
  rightPct: number;      // 0-100; pair with leftPct sums to ~100
};

export type StateScore = {
  code: string;          // "CA"
  name: string;          // "California"
  score: number;         // 0-100 ICP / fit score
};

export type ChatReplyStructured = {
  intro: string;                       // 1-2 sentences, always present
  comparisons?: Comparison[];          // optional, 0-3
  states?: StateScore[];               // optional, 3-6 to highlight on mini map
  statesCaption?: string;
  whatsWorking?: string[];             // optional bullets, max 3
  watchOuts?: string[];                // optional bullets, max 3
  recommendation: string;              // 1 sentence, always present
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;                     // plain-text copy / fallback
  structured?: ChatReplyStructured;    // assistant only, when JSON parse succeeded
  timestamp: string;                   // ISO
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
