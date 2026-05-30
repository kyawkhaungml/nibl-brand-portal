import 'server-only';

import { env } from '@/lib/env';
import { kaceMockData } from '@/lib/mock-data';
import type {
  BrandRanking,
  DailyPairingPoint,
  DateRange,
  DrinkVariantPerformance,
  FoodCombo,
  NeighborhoodPerformance,
  PairingSummary,
  TimeOfDayBucket,
} from '@/types';

function rangeDays(range: DateRange): number {
  return range === '7D' ? 7 : range === '30D' ? 30 : 90;
}

export async function getPairingSummary(
  _brandId: string,
  _range: DateRange,
): Promise<PairingSummary> {
  if (env.useMockData) return kaceMockData.summary;
  // TODO(v2): aggregate from product_pairings + drink_reviews + qr_scans filtered by brand.
  throw new Error('Real data wiring not implemented; set NEXT_PUBLIC_USE_MOCK_DATA=true.');
}

export async function getDailyPairings(
  _brandId: string,
  range: DateRange,
): Promise<DailyPairingPoint[]> {
  if (env.useMockData) {
    const days = rangeDays(range);
    return kaceMockData.dailyPairings.slice(-days);
  }
  throw new Error('Real data wiring not implemented.');
}

export async function getDrinkVariants(
  _brandId: string,
): Promise<DrinkVariantPerformance[]> {
  if (env.useMockData) return kaceMockData.drinkVariants;
  throw new Error('Real data wiring not implemented.');
}

export async function getFoodCombos(_brandId: string): Promise<FoodCombo[]> {
  if (env.useMockData) return kaceMockData.foodCombos;
  throw new Error('Real data wiring not implemented.');
}

export async function getNeighborhoods(
  _brandId: string,
): Promise<NeighborhoodPerformance[]> {
  if (env.useMockData) return kaceMockData.neighborhoods;
  throw new Error('Real data wiring not implemented.');
}

export async function getTimeOfDay(_brandId: string): Promise<TimeOfDayBucket[]> {
  if (env.useMockData) return kaceMockData.timeOfDay;
  throw new Error('Real data wiring not implemented.');
}

export async function getBrandLeaderboard(_brandId: string): Promise<BrandRanking[]> {
  if (env.useMockData) return kaceMockData.brandLeaderboard;
  // TODO(v2): aggregate product_pairings + drink_reviews + qr_scans across all
  // partner brands; rank by pairings (or a composite score). Mark the current
  // brand's row with isYou = true.
  throw new Error('Real data wiring not implemented.');
}
