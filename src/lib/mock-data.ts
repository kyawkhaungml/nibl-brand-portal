import type {
  BrandCampaign,
  BrandPartner,
  BrandRanking,
  CampaignBenchmark,
  CampaignTimelinePoint,
  CustomerSegment,
  DailyPairingPoint,
  Demographics,
  DrinkVariantPerformance,
  FoodCombo,
  NeighborhoodPerformance,
  PairingSummary,
  RepeatBehavior,
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
  id: '00000000-0000-0000-0000-000000summer',
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

export const kaceMockData = {
  brand,
  campaign,
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
};
