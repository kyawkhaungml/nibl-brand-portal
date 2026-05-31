export type BrandPartner = {
  id: string;
  name: string;
  email: string;
  logoUrl: string | null;
  supabaseUserId: string;
  createdAt: string;
};

export type CodeAttribution = {
  promoCode: string;
  redemptions: number;     // unique customers who used the code
  conversionRate: number;  // percent, 0-100 = redemptions / samples
  totalOrders: number;     // includes repeat purchases
  revenueCents: number;
};

export type StateStatus = 'active' | 'opportunity' | 'low-match';

export type CityPerformance = {
  name: string;
  estReach: number;          // estimated NiBL-eligible customers in the city
  predictedScanRate: number;
  icpMatch: number;
};

export type StateIcpSnapshot = {
  citrusPreference: number;
  carbonationPreference: number;
  spiceTolerance: number;
  topCuisines: string[];     // top 3
  peakTime: string;
  avgOrderValue: number;
  recommendation: string;    // one-line "why this state" callout
};

export type StatePerformance = {
  code: string;              // 2-letter, e.g. "NY"
  name: string;
  status: StateStatus;
  deliveries?: number;       // only present when status === 'active'
  predictedScanRate: number;
  icpMatch: number;          // 0-100
  topCity: string;
  icpSnapshot: StateIcpSnapshot;
  cities?: CityPerformance[];                  // non-NY states
  neighborhoods?: NeighborhoodPerformance[];   // NY only
};

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'pending';

export type UserCampaignExtras = {
  targetNeighborhoods: string[];
  promoCode: string;
  notes: string;
  samplesUsed?: number;     // user campaigns start at 0; not used by detail KPIs
};

export type BrandCampaign = {
  id: string;
  brandId: string;
  name: string;
  drinkName: string;
  drinkVariants: string[];
  startDate: string;
  endDate: string | null;
  status: CampaignStatus;
  totalBudget: number;
  costPerSample: number;
  /** Present on completed/past mock campaigns; live ones compute from summary. */
  samplesUsed?: number;
  /** Only on user-created (localStorage) campaigns. */
  extras?: UserCampaignExtras;
};

export type DateRange = '7D' | '30D' | '90D';

export type PairingSummary = {
  totalPairings: number;
  totalPairingsDelta: number;
  scanRate: number;
  scanRateDelta: number;
  avgRating: number;
  avgRatingDelta: number;
  purchaseIntent: number;
  purchaseIntentDelta: number;
};

export type DailyPairingPoint = {
  date: string;
  pairings: number;
  scans: number;
  scanRate: number;
  rating: number;
};

export type DrinkVariantPerformance = {
  variant: string;
  pairings: number;
  avgRating: number;
  scanRate: number;      // % of customers who scanned the QR for this variant
  wouldBuyAgain: number; // % "would buy again" for this variant
};

export type BrandRanking = {
  rank: number;
  brand: string;
  category: string;        // e.g. "Sparkling water", "Cold brew"
  pairings: number;
  scanRate: number;
  avgRating: number;
  isYou?: boolean;
};

export type FoodCombo = {
  food: string;
  timesPaired: number;
  avgRating: number;
  scanRate: number;
};

export type NeighborhoodPerformance = {
  neighborhood: string;
  pairings: number;
  scans: number;
  scanRate: number;
  avgRating: number;
};

export type TimeOfDayBucket = {
  bucket: 'Breakfast' | 'Lunch' | 'Afternoon' | 'Dinner' | 'Late night';
  pairings: number;
};

export type TasteDimension = {
  key: 'sweet' | 'spice' | 'citrus' | 'carbonation' | 'umami' | 'bold';
  label: string;
  score: number;
};

export type CustomerSegment = {
  name: string;
  share: number;
};

export type RepeatBehavior = {
  repeatRate: number;
  avgDaysBetween: number;
};

export type Demographics = {
  orderTimePreference: 'lunch' | 'dinner' | 'evening';
  avgOrderValue: number;
  topCuisines: { cuisine: string; orders: number }[];
};

export type TasteAnalytics = {
  dimensions: TasteDimension[];
  segments: CustomerSegment[];
  repeat: RepeatBehavior;
  demographics: Demographics;
};

export type CampaignBenchmark = {
  metric: 'Scan rate' | 'Avg rating' | 'Purchase intent';
  brand: number;
  benchmark: number;
};

export type CampaignTimelinePoint = {
  date: string;
  samples: number;
  scanRate: number;
};

export type AISuggestion = {
  title: string;
  body: string;
};
