import { OverviewClient } from './overview-client';
import { getCurrentBrandId } from '@/lib/brand';
import {
  getBrandLeaderboard,
  getCodeAttribution,
  getDailyPairings,
  getDrinkVariants,
  getFoodCombos,
  getNeighborhoods,
  getPairingSummary,
  getTimeOfDay,
} from '@/lib/api/pairing-insights';
import { getBenchmark } from '@/lib/api/campaigns';
import { kaceMockData } from '@/lib/mock-data';
import type { DateRange } from '@/types';

function parseRange(raw: string | undefined): DateRange {
  return raw === '7D' || raw === '30D' || raw === '90D' ? raw : '30D';
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const brandId = await getCurrentBrandId();
  const range = parseRange(searchParams.range);
  const [
    summary,
    daily,
    combos,
    hoods,
    tod,
    benchmark,
    leaderboard,
    variants,
    attribution,
  ] = await Promise.all([
    getPairingSummary(brandId, range),
    getDailyPairings(brandId, range),
    getFoodCombos(brandId),
    getNeighborhoods(brandId),
    getTimeOfDay(brandId),
    getBenchmark(brandId),
    getBrandLeaderboard(brandId),
    getDrinkVariants(brandId),
    getCodeAttribution(brandId),
  ]);

  return (
    <OverviewClient
      range={range}
      summary={summary}
      daily={daily}
      combos={combos}
      hoods={hoods}
      tod={tod}
      benchmark={benchmark}
      leaderboard={leaderboard}
      variants={variants}
      attribution={attribution}
      avgOrderValue={kaceMockData.demographics.avgOrderValue}
    />
  );
}
