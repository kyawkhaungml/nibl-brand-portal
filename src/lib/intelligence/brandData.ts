import type { AffinityMatrix } from './types';

// Full data context injected into every Claude call from the Intelligence page.
// Sourced from the Kace Beverages demo dataset (see src/lib/mock-data.ts).

export const BRAND_DATA_CONTEXT = {
  brand: 'Kace Beverages',
  campaign: 'Summer Pairing Campaign',
  totalCustomers: 847,
  campaignPeriod: 'Feb 28 - ongoing',

  customerICP: {
    tasteProfile: {
      citrusPreference: 81,
      carbonationPreference: 76,
      spiceTolerance: 72,
      sweetAffinity: 68,
      boldFlavorPreference: 64,
      umamiPreference: 58,
    },
    segments: {
      spiceLovers: 28,
      healthConscious: 22,
      sweetTooth: 18,
      comfortFoodFans: 16,
      adventurousEaters: 16,
    },
    orderPatterns: {
      peakTime: 'Dinner 7-9 PM',
      avgOrderValue: 28.4,
      topCuisines: [
        { cuisine: 'Asian fusion', orders: 184 },
        { cuisine: 'Salads & bowls', orders: 161 },
        { cuisine: 'Japanese', orders: 142 },
        { cuisine: 'Mexican', orders: 98 },
        { cuisine: 'American', orders: 87 },
      ],
    },
    retention: {
      repeatRate: 41,
      avgDaysToReorder: 8.6,
    },
  },

  flavorPerformance: [
    { flavor: 'Yuzu', pairings: 312, scanRate: 74, avgRating: 4.8, buyAgain: 41 },
    { flavor: 'Yuzu Mint', pairings: 198, scanRate: 70, avgRating: 4.6, buyAgain: 36 },
    { flavor: 'Hibiscus Lime', pairings: 156, scanRate: 71, avgRating: 4.7, buyAgain: 38 },
    { flavor: 'Yuzu Ginger', pairings: 121, scanRate: 65, avgRating: 4.5, buyAgain: 31 },
    { flavor: 'Cold Brew Tonic', pairings: 60, scanRate: 58, avgRating: 4.3, buyAgain: 22 },
  ],

  flavorFoodAffinityMatrix: {
    Yuzu:              { Japanese: 0.91, Salads: 0.84, Asian: 0.88, American: 0.54, Spicy: 0.71, Mexican: 0.62 },
    'Yuzu Mint':       { Japanese: 0.79, Salads: 0.88, Asian: 0.75, American: 0.61, Spicy: 0.65, Mexican: 0.58 },
    'Hibiscus Lime':   { Japanese: 0.72, Salads: 0.81, Asian: 0.69, American: 0.74, Spicy: 0.58, Mexican: 0.77 },
    'Yuzu Ginger':     { Japanese: 0.68, Salads: 0.71, Asian: 0.82, American: 0.59, Spicy: 0.89, Mexican: 0.64 },
    'Cold Brew Tonic': { Japanese: 0.61, Salads: 0.74, Asian: 0.66, American: 0.78, Spicy: 0.52, Mexican: 0.69 },
  } as AffinityMatrix,

  neighborhoodPerformance: [
    { area: 'East Village', deliveries: 264, scanRate: 75, rating: 4.8 },
    { area: 'Lower East Side', deliveries: 187, scanRate: 71, rating: 4.7 },
    { area: 'Stuy Town', deliveries: 154, scanRate: 64, rating: 4.6 },
    { area: 'Peter Cooper Village', deliveries: 121, scanRate: 65, rating: 4.5 },
    { area: 'Morningside Heights', deliveries: 78, scanRate: 53, rating: 4.5 },
    { area: 'Gramercy', deliveries: 43, scanRate: 42, rating: 4.3 },
  ],

  benchmarks: {
    categoryAvgScanRate: 52,
    categoryAvgRating: 4.5,
    categoryAvgBuyAgain: 31,
    brandRankInCategory: 2,
    totalBrandsInCategory: 12,
  },
} as const;

export const FOOD_CATEGORIES = [
  'Japanese',
  'Salads',
  'Asian',
  'American',
  'Spicy',
  'Mexican',
] as const;

export const FLAVORS = [
  'Yuzu',
  'Yuzu Mint',
  'Hibiscus Lime',
  'Yuzu Ginger',
  'Cold Brew Tonic',
] as const;
