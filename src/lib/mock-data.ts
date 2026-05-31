import type {
  BrandCampaign,
  BrandPartner,
  BrandRanking,
  CampaignBenchmark,
  CampaignTimelinePoint,
  CodeAttribution,
  CustomerSegment,
  DailyPairingPoint,
  Demographics,
  DrinkVariantPerformance,
  FoodCombo,
  NeighborhoodPerformance,
  PairingSummary,
  RepeatBehavior,
  StatePerformance,
  TasteDimension,
  TimeOfDayBucket,
} from '@/types';

const TODAY = new Date('2026-05-28T12:00:00Z');

function daysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

// Deterministic pseudo-random so the demo numbers don't shift per render.
function pseudo(seed: number): number {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

const brand: BrandPartner = {
  id: '00000000-0000-0000-0000-00000000kace',
  name: 'Kace Beverages',
  email: 'partners@kacebev.com',
  logoUrl: null,
  supabaseUserId: 'demo-supabase-user',
  createdAt: '2026-03-01T00:00:00Z',
};

const campaign: BrandCampaign = {
  id: 'summer-2026',
  brandId: brand.id,
  name: 'Summer Pairing Campaign',
  drinkName: 'Kace Sparkling Yuzu',
  drinkVariants: ['Yuzu', 'Yuzu Mint', 'Yuzu Ginger', 'Hibiscus Lime', 'Cold Brew Tonic'],
  startDate: daysAgo(89),
  endDate: null,
  status: 'active',
  totalBudget: 1000,
  costPerSample: 2.5,
};

const campaigns: BrandCampaign[] = [
  campaign,
  {
    id: 'spring-launch-2026',
    brandId: brand.id,
    name: 'Spring Launch',
    drinkName: 'Hibiscus Lime',
    drinkVariants: ['Hibiscus Lime', 'Yuzu'],
    startDate: daysAgo(180),
    endDate: daysAgo(120),
    status: 'completed',
    totalBudget: 600,
    costPerSample: 2.5,
    samplesUsed: 600,
  },
  {
    id: 'holiday-2025',
    brandId: brand.id,
    name: 'Holiday Sampler',
    drinkName: 'Yuzu Ginger',
    drinkVariants: ['Yuzu Ginger', 'Cold Brew Tonic', 'Yuzu Mint'],
    startDate: daysAgo(280),
    endDate: daysAgo(220),
    status: 'completed',
    totalBudget: 1500,
    costPerSample: 2.25,
    samplesUsed: 1200,
  },
];

const dailyPairings: DailyPairingPoint[] = Array.from({ length: 90 }, (_, i) => {
  const dayIndex = 89 - i;
  const date = daysAgo(dayIndex);
  const weekend = new Date(date).getUTCDay() >= 5;
  const base = 7 + Math.round(pseudo(dayIndex + 1) * 6);
  const pairings = base + (weekend ? 4 : 0);
  const scanRate = 0.6 + pseudo(dayIndex + 11) * 0.18;
  const scans = Math.round(pairings * scanRate);
  const rating = 4.4 + pseudo(dayIndex + 21) * 0.5;
  return {
    date,
    pairings,
    scans,
    scanRate: Math.round(scanRate * 1000) / 10,
    rating: Math.round(rating * 10) / 10,
  };
});

const summary: PairingSummary = {
  totalPairings: 847,
  totalPairingsDelta: 12.4,
  scanRate: 68,
  scanRateDelta: 3.1,
  avgRating: 4.7,
  avgRatingDelta: 0.2,
  purchaseIntent: 34,
  purchaseIntentDelta: -1.4,
};

const drinkVariants: DrinkVariantPerformance[] = [
  { variant: 'Yuzu',            pairings: 312, avgRating: 4.8, scanRate: 74, wouldBuyAgain: 41 },
  { variant: 'Yuzu Mint',       pairings: 198, avgRating: 4.6, scanRate: 70, wouldBuyAgain: 36 },
  { variant: 'Hibiscus Lime',   pairings: 156, avgRating: 4.7, scanRate: 71, wouldBuyAgain: 38 },
  { variant: 'Yuzu Ginger',     pairings: 121, avgRating: 4.5, scanRate: 65, wouldBuyAgain: 31 },
  { variant: 'Cold Brew Tonic', pairings:  60, avgRating: 4.3, scanRate: 58, wouldBuyAgain: 22 },
];

// Leaderboard of partner brands on NiBL this month. "Kace Beverages" is the
// current portal user — used to highlight their row + a "your rank" callout.
const brandLeaderboard: BrandRanking[] = [
  { rank: 1, brand: 'LEVL Energy',       category: 'Functional',      pairings: 1284, scanRate: 73, avgRating: 4.8 },
  { rank: 2, brand: 'Kace Beverages',    category: 'Sparkling',        pairings:  847, scanRate: 68, avgRating: 4.7, isYou: true },
  { rank: 3, brand: 'Olipop',            category: 'Prebiotic soda',   pairings:  712, scanRate: 64, avgRating: 4.6 },
  { rank: 4, brand: 'Liquid Death',      category: 'Sparkling water',  pairings:  598, scanRate: 61, avgRating: 4.4 },
  { rank: 5, brand: 'Recess Mood',       category: 'Adaptogen',        pairings:  421, scanRate: 55, avgRating: 4.3 },
];

const foodCombos: FoodCombo[] = [
  { food: 'Spicy Ramen', timesPaired: 91, avgRating: 4.8, scanRate: 81 },
  { food: 'Sweetgreen Harvest Bowl', timesPaired: 84, avgRating: 4.8, scanRate: 74 },
  { food: 'Chopt Mexican Caesar', timesPaired: 72, avgRating: 4.6, scanRate: 71 },
  { food: 'Playa Bowls Acai', timesPaired: 65, avgRating: 4.7, scanRate: 69 },
  { food: 'Pho Bang Beef Pho', timesPaired: 51, avgRating: 4.5, scanRate: 66 },
  { food: 'Joe’s Pizza Slice', timesPaired: 47, avgRating: 4.4, scanRate: 58 },
  { food: 'Sushi by Boū Omakase', timesPaired: 42, avgRating: 4.9, scanRate: 81 },
  { food: 'Veselka Pierogi', timesPaired: 38, avgRating: 4.6, scanRate: 64 },
  { food: 'Momofuku Spicy Noodles', timesPaired: 36, avgRating: 4.7, scanRate: 73 },
  { food: 'Xi’an Famous Liang Pi', timesPaired: 34, avgRating: 4.8, scanRate: 78 },
  { food: 'Mamoun’s Falafel', timesPaired: 28, avgRating: 4.5, scanRate: 61 },
  { food: 'Russ & Daughters Bagel', timesPaired: 24, avgRating: 4.6, scanRate: 67 },
  { food: 'Cha Cha Matcha', timesPaired: 18, avgRating: 4.4, scanRate: 55 },
];

const neighborhoods: NeighborhoodPerformance[] = [
  { neighborhood: 'East Village', pairings: 264, scans: 198, scanRate: 75, avgRating: 4.8 },
  { neighborhood: 'Lower East Side', pairings: 187, scans: 132, scanRate: 71, avgRating: 4.7 },
  { neighborhood: 'Stuy Town', pairings: 154, scans: 99, scanRate: 64, avgRating: 4.6 },
  { neighborhood: 'Peter Cooper Village', pairings: 121, scans: 79, scanRate: 65, avgRating: 4.5 },
  { neighborhood: 'Morningside Heights', pairings: 78, scans: 41, scanRate: 53, avgRating: 4.4 },
  { neighborhood: 'Gramercy', pairings: 43, scans: 18, scanRate: 42, avgRating: 4.3 },
];

const timeOfDay: TimeOfDayBucket[] = [
  { bucket: 'Breakfast', pairings: 48 },
  { bucket: 'Lunch', pairings: 214 },
  { bucket: 'Afternoon', pairings: 132 },
  { bucket: 'Dinner', pairings: 381 },
  { bucket: 'Late night', pairings: 72 },
];

const tasteDimensions: TasteDimension[] = [
  { key: 'sweet', label: 'Sweet affinity', score: 68 },
  { key: 'spice', label: 'Spice tolerance', score: 72 },
  { key: 'citrus', label: 'Citrus preference', score: 81 },
  { key: 'carbonation', label: 'Carbonation preference', score: 76 },
  { key: 'umami', label: 'Umami preference', score: 58 },
  { key: 'bold', label: 'Bold flavor preference', score: 64 },
];

const customerSegments: CustomerSegment[] = [
  { name: 'Spice lovers', share: 28 },
  { name: 'Sweet tooth', share: 18 },
  { name: 'Health conscious', share: 22 },
  { name: 'Comfort food fans', share: 16 },
  { name: 'Adventurous eaters', share: 16 },
];

const repeat: RepeatBehavior = {
  repeatRate: 41,
  avgDaysBetween: 8.6,
};

const demographics: Demographics = {
  orderTimePreference: 'dinner',
  avgOrderValue: 28.4,
  topCuisines: [
    { cuisine: 'Asian fusion', orders: 184 },
    { cuisine: 'Salads & bowls', orders: 161 },
    { cuisine: 'Japanese', orders: 142 },
    { cuisine: 'Mexican', orders: 98 },
    { cuisine: 'American', orders: 87 },
  ],
};

const benchmark: CampaignBenchmark[] = [
  { metric: 'Scan rate', brand: 68, benchmark: 52 },
  { metric: 'Avg rating', brand: 4.7, benchmark: 4.3 },
  { metric: 'Purchase intent', brand: 34, benchmark: 26 },
];

const campaignTimeline: CampaignTimelinePoint[] = dailyPairings.map((d) => ({
  date: d.date,
  samples: d.pairings,
  scanRate: d.scanRate,
}));

// State-level performance for the choropleth + drilldown on /campaigns.
// NY is the live market; everything else is a predicted-fit opportunity.
const geoBreakdown: StatePerformance[] = [
  {
    code: 'NY',
    name: 'New York',
    status: 'active',
    deliveries: 847,
    predictedScanRate: 68,
    icpMatch: 100,
    topCity: 'New York City',
    icpSnapshot: {
      citrusPreference: 81,
      carbonationPreference: 76,
      spiceTolerance: 72,
      topCuisines: ['Asian fusion', 'Salads & bowls', 'Japanese'],
      peakTime: 'Dinner 7-9 PM',
      avgOrderValue: 28.4,
      recommendation:
        'Your home market. East Village is your strongest neighborhood (75% scan rate); LES is your second largest.',
    },
    neighborhoods: neighborhoods,
  },
  {
    code: 'CA',
    name: 'California',
    status: 'opportunity',
    predictedScanRate: 72,
    icpMatch: 89,
    topCity: 'Los Angeles',
    icpSnapshot: {
      citrusPreference: 86,
      carbonationPreference: 80,
      spiceTolerance: 75,
      topCuisines: ['Sushi', 'Mexican', 'Healthy bowls'],
      peakTime: 'Dinner 6-9 PM',
      avgOrderValue: 31.2,
      recommendation:
        'Highest predicted ICP match outside NY — LA + SF index 89% on your top-buyer profile.',
    },
    cities: [
      { name: 'Los Angeles', estReach: 12400, predictedScanRate: 72, icpMatch: 89 },
      { name: 'San Francisco', estReach: 8200, predictedScanRate: 74, icpMatch: 92 },
      { name: 'San Diego', estReach: 5100, predictedScanRate: 68, icpMatch: 84 },
    ],
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    status: 'opportunity',
    predictedScanRate: 70,
    icpMatch: 85,
    topCity: 'Boston',
    icpSnapshot: {
      citrusPreference: 79,
      carbonationPreference: 78,
      spiceTolerance: 68,
      topCuisines: ['Seafood', 'Asian fusion', 'Salads & bowls'],
      peakTime: 'Dinner 7-10 PM',
      avgOrderValue: 29.8,
      recommendation:
        'Boston-Cambridge corridor pairs your top variants with seafood — 85% predicted ICP match.',
    },
    cities: [
      { name: 'Boston', estReach: 7800, predictedScanRate: 71, icpMatch: 86 },
      { name: 'Cambridge', estReach: 4200, predictedScanRate: 73, icpMatch: 88 },
    ],
  },
  {
    code: 'WA',
    name: 'Washington',
    status: 'opportunity',
    predictedScanRate: 69,
    icpMatch: 82,
    topCity: 'Seattle',
    icpSnapshot: {
      citrusPreference: 77,
      carbonationPreference: 82,
      spiceTolerance: 65,
      topCuisines: ['Asian fusion', 'Coffee bars', 'Sushi'],
      peakTime: 'Afternoon 2-5 PM',
      avgOrderValue: 27.6,
      recommendation:
        'Seattle over-indexes on carbonation preference (82%) — Yuzu Mint should lead the launch.',
    },
    cities: [
      { name: 'Seattle', estReach: 9100, predictedScanRate: 69, icpMatch: 82 },
      { name: 'Bellevue', estReach: 2300, predictedScanRate: 67, icpMatch: 80 },
    ],
  },
  {
    code: 'IL',
    name: 'Illinois',
    status: 'opportunity',
    predictedScanRate: 65,
    icpMatch: 80,
    topCity: 'Chicago',
    icpSnapshot: {
      citrusPreference: 74,
      carbonationPreference: 72,
      spiceTolerance: 70,
      topCuisines: ['Asian fusion', 'Italian', 'Salads & bowls'],
      peakTime: 'Dinner 7-9 PM',
      avgOrderValue: 26.8,
      recommendation:
        'Chicago Loop + West Loop are your strongest fit; Hibiscus Lime expected to over-index here.',
    },
    cities: [
      { name: 'Chicago', estReach: 11200, predictedScanRate: 65, icpMatch: 80 },
      { name: 'Evanston', estReach: 1800, predictedScanRate: 68, icpMatch: 83 },
    ],
  },
  {
    code: 'CO',
    name: 'Colorado',
    status: 'opportunity',
    predictedScanRate: 67,
    icpMatch: 79,
    topCity: 'Denver',
    icpSnapshot: {
      citrusPreference: 76,
      carbonationPreference: 79,
      spiceTolerance: 64,
      topCuisines: ['Healthy bowls', 'Asian fusion', 'Mexican'],
      peakTime: 'Lunch 12-2 PM',
      avgOrderValue: 26.4,
      recommendation:
        'Denver + Boulder skew health-conscious; lunch slots are 18% higher engagement.',
    },
    cities: [
      { name: 'Denver', estReach: 6400, predictedScanRate: 67, icpMatch: 79 },
      { name: 'Boulder', estReach: 1900, predictedScanRate: 70, icpMatch: 84 },
    ],
  },
  {
    code: 'DC',
    name: 'District of Columbia',
    status: 'opportunity',
    predictedScanRate: 66,
    icpMatch: 78,
    topCity: 'Washington',
    icpSnapshot: {
      citrusPreference: 75,
      carbonationPreference: 74,
      spiceTolerance: 69,
      topCuisines: ['Asian fusion', 'Mediterranean', 'Salads & bowls'],
      peakTime: 'Lunch 12-2 PM',
      avgOrderValue: 28.1,
      recommendation:
        'Government corridor lunch crowd — concentrate samples in NW and Capitol Hill.',
    },
    cities: [
      { name: 'Washington', estReach: 5400, predictedScanRate: 66, icpMatch: 78 },
    ],
  },
  {
    code: 'OR',
    name: 'Oregon',
    status: 'opportunity',
    predictedScanRate: 64,
    icpMatch: 76,
    topCity: 'Portland',
    icpSnapshot: {
      citrusPreference: 73,
      carbonationPreference: 76,
      spiceTolerance: 62,
      topCuisines: ['Coffee bars', 'Asian fusion', 'Vegan'],
      peakTime: 'Afternoon 2-5 PM',
      avgOrderValue: 24.9,
      recommendation:
        'Portland leans vegan + carbonated; consider a Hibiscus Lime + non-alc cocktail angle.',
    },
    cities: [
      { name: 'Portland', estReach: 4900, predictedScanRate: 64, icpMatch: 76 },
    ],
  },
  {
    code: 'TX',
    name: 'Texas',
    status: 'opportunity',
    predictedScanRate: 58,
    icpMatch: 65,
    topCity: 'Austin',
    icpSnapshot: {
      citrusPreference: 71,
      carbonationPreference: 68,
      spiceTolerance: 84,
      topCuisines: ['Tex-Mex', 'BBQ', 'Asian fusion'],
      peakTime: 'Dinner 7-10 PM',
      avgOrderValue: 25.3,
      recommendation:
        'Austin only — your Yuzu Ginger over-indexes on spicy pairings (84% spice tolerance).',
    },
    cities: [
      { name: 'Austin', estReach: 5200, predictedScanRate: 65, icpMatch: 78 },
      { name: 'Houston', estReach: 3800, predictedScanRate: 54, icpMatch: 58 },
      { name: 'Dallas', estReach: 3400, predictedScanRate: 56, icpMatch: 60 },
    ],
  },
  {
    code: 'GA',
    name: 'Georgia',
    status: 'opportunity',
    predictedScanRate: 56,
    icpMatch: 62,
    topCity: 'Atlanta',
    icpSnapshot: {
      citrusPreference: 68,
      carbonationPreference: 64,
      spiceTolerance: 72,
      topCuisines: ['Southern', 'Soul food', 'Tex-Mex'],
      peakTime: 'Dinner 7-9 PM',
      avgOrderValue: 24.6,
      recommendation:
        'Atlanta only — 62% match. Concentrate samples in Buckhead and Midtown.',
    },
    cities: [
      { name: 'Atlanta', estReach: 4100, predictedScanRate: 56, icpMatch: 62 },
    ],
  },
  {
    code: 'MI',
    name: 'Michigan',
    status: 'opportunity',
    predictedScanRate: 54,
    icpMatch: 58,
    topCity: 'Ann Arbor',
    icpSnapshot: {
      citrusPreference: 66,
      carbonationPreference: 62,
      spiceTolerance: 60,
      topCuisines: ['American', 'Asian fusion', 'Italian'],
      peakTime: 'Dinner 6-9 PM',
      avgOrderValue: 22.8,
      recommendation:
        'Ann Arbor over-indexes (university crowd); Detroit is a soft launch.',
    },
    cities: [
      { name: 'Ann Arbor', estReach: 1700, predictedScanRate: 62, icpMatch: 72 },
      { name: 'Detroit', estReach: 2400, predictedScanRate: 50, icpMatch: 52 },
    ],
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    status: 'opportunity',
    predictedScanRate: 53,
    icpMatch: 55,
    topCity: 'Philadelphia',
    icpSnapshot: {
      citrusPreference: 64,
      carbonationPreference: 60,
      spiceTolerance: 58,
      topCuisines: ['American', 'Italian', 'Asian fusion'],
      peakTime: 'Dinner 7-9 PM',
      avgOrderValue: 22.1,
      recommendation:
        'Philly Center City is the strongest pocket; broad PA rollout would dilute the campaign.',
    },
    cities: [
      { name: 'Philadelphia', estReach: 3200, predictedScanRate: 53, icpMatch: 55 },
    ],
  },
  {
    code: 'FL',
    name: 'Florida',
    status: 'opportunity',
    predictedScanRate: 51,
    icpMatch: 52,
    topCity: 'Miami',
    icpSnapshot: {
      citrusPreference: 79,
      carbonationPreference: 70,
      spiceTolerance: 64,
      topCuisines: ['Cuban', 'Seafood', 'Latin fusion'],
      peakTime: 'Late night 10 PM-1 AM',
      avgOrderValue: 26.7,
      recommendation:
        'Miami over-indexes on citrus (79%) but the FL late-night profile is a poor fit for Kace.',
    },
    cities: [
      { name: 'Miami', estReach: 4600, predictedScanRate: 60, icpMatch: 68 },
      { name: 'Tampa', estReach: 1900, predictedScanRate: 46, icpMatch: 45 },
    ],
  },
  {
    code: 'OH',
    name: 'Ohio',
    status: 'low-match',
    predictedScanRate: 38,
    icpMatch: 42,
    topCity: 'Columbus',
    icpSnapshot: {
      citrusPreference: 52,
      carbonationPreference: 56,
      spiceTolerance: 50,
      topCuisines: ['American', 'Italian', 'BBQ'],
      peakTime: 'Dinner 6-8 PM',
      avgOrderValue: 19.4,
      recommendation:
        'Not a recommended early market — taste profile diverges from Kace\'s top buyers.',
    },
    cities: [
      { name: 'Columbus', estReach: 1400, predictedScanRate: 38, icpMatch: 42 },
    ],
  },
  {
    code: 'NC',
    name: 'North Carolina',
    status: 'low-match',
    predictedScanRate: 36,
    icpMatch: 41,
    topCity: 'Raleigh',
    icpSnapshot: {
      citrusPreference: 54,
      carbonationPreference: 52,
      spiceTolerance: 56,
      topCuisines: ['Southern', 'BBQ', 'American'],
      peakTime: 'Dinner 6-8 PM',
      avgOrderValue: 19.8,
      recommendation:
        'Skip for now — pair-with-spice signal exists but the broader ICP gap is too wide.',
    },
    cities: [
      { name: 'Raleigh', estReach: 1100, predictedScanRate: 36, icpMatch: 41 },
    ],
  },
];

// Brand-issued promo code redemption attribution.
// 218 sampled customers redeemed → 218 / 847 = 25.7% conversion.
// Their 41% repeat behavior carries forward to ~376 total orders @ $28.40 AOV.
const codeAttribution: CodeAttribution = {
  promoCode: 'KACE10',
  redemptions: 218,
  conversionRate: 25.7,
  totalOrders: 376,
  revenueCents: 1067840, // $10,678.40
};

export const kaceMockData = {
  brand,
  campaign,
  campaigns,
  summary,
  dailyPairings,
  drinkVariants,
  foodCombos,
  neighborhoods,
  timeOfDay,
  tasteDimensions,
  customerSegments,
  repeat,
  demographics,
  benchmark,
  campaignTimeline,
  brandLeaderboard,
  codeAttribution,
  geoBreakdown,
};
