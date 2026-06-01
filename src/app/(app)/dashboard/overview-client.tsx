'use client';

import { Clock, ExternalLink, MapPin, Trophy } from 'lucide-react';
import { AreaChart } from '@/components/charts/area-chart';
import { BenchmarkRows } from '@/components/cards/benchmark-rows';
import { BrandLeaderboard } from '@/components/cards/brand-leaderboard';
import { HeroCard } from '@/components/cards/hero-card';
import { HighlightCard } from '@/components/cards/highlight-card';
import { KPICard } from '@/components/cards/kpi-card';
import { RangeToggle } from '@/components/range-toggle';
import { DownloadReportButton } from '@/components/dashboard/download-report-button';
import { SmartAlerts } from '@/components/dashboard/smart-alerts';
import { TopKpiRow } from '@/components/dashboard/top-kpi-row';
import { useBrand } from '@/components/brand/brand-context';
import type {
  BrandRanking,
  CampaignBenchmark,
  CodeAttribution,
  DailyPairingPoint,
  DateRange,
  DrinkVariantPerformance,
  FoodCombo,
  NeighborhoodPerformance,
  PairingSummary,
  TimeOfDayBucket,
} from '@/types';

function bestTimeWindow(buckets: TimeOfDayBucket[]): {
  bucket: TimeOfDayBucket['bucket'];
  window: string;
} {
  const sorted = [...buckets].sort((a, b) => b.pairings - a.pairings);
  const top = sorted[0]?.bucket ?? 'Dinner';
  const window =
    top === 'Breakfast'
      ? '7–10 AM'
      : top === 'Lunch'
        ? '11 AM – 2 PM'
        : top === 'Afternoon'
          ? '2–5 PM'
          : top === 'Dinner'
            ? '7–9 PM'
            : '10 PM – 1 AM';
  return { bucket: top, window };
}

export function OverviewClient({
  range,
  summary,
  daily,
  combos,
  hoods,
  tod,
  benchmark,
  leaderboard,
  variants,
  attribution,
  avgOrderValue,
}: {
  range: DateRange;
  summary: PairingSummary;
  daily: DailyPairingPoint[];
  combos: FoodCombo[];
  hoods: NeighborhoodPerformance[];
  tod: TimeOfDayBucket[];
  benchmark: CampaignBenchmark[];
  leaderboard: BrandRanking[];
  variants: DrinkVariantPerformance[];
  attribution: CodeAttribution;
  avgOrderValue: number;
}) {
  const topCombo = [...combos].sort((a, b) => b.scanRate - a.scanRate)[0];
  const topHood = [...hoods].sort((a, b) => b.scanRate - a.scanRate)[0];
  const bestTime = bestTimeWindow(tod);
  const brand = useBrand();

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <a
          href="https://nibl.food"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Browse NiBL
        </a>
        <DownloadReportButton
          summary={summary}
          benchmark={benchmark}
          brandName={brand.name}
        />
      </div>
      <TopKpiRow
        variants={variants}
        attribution={attribution}
        avgOrderValue={avgOrderValue}
      />
      <HeroCard
        customers={summary.totalPairings}
        scanRate={summary.scanRate}
        rating={summary.avgRating}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Drinks delivered"
          value={summary.totalPairings.toLocaleString()}
          delta={summary.totalPairingsDelta}
        />
        <KPICard
          label="Customers scanned"
          value={`${summary.scanRate}% scan rate`}
          delta={summary.scanRateDelta}
        />
        <KPICard
          label="Loved it"
          value={`${summary.avgRating.toFixed(1)} / 5 stars`}
          delta={summary.avgRatingDelta}
        />
        <KPICard
          label="Would buy again"
          value={`${summary.purchaseIntent}%`}
          delta={summary.purchaseIntentDelta}
        />
      </div>

      <div id="daily-reach" className="nibl-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-medium text-foreground">Daily reach</div>
          <RangeToggle current={range} />
        </div>
        <AreaChart
          data={daily.map((d) => ({ date: d.date.slice(5), pairings: d.pairings }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <HighlightCard
          icon={Trophy}
          label="Best pairing"
          title={topCombo?.food ?? '—'}
          subtitle={topCombo ? `${topCombo.scanRate}% scan rate` : ''}
        />
        <HighlightCard
          icon={MapPin}
          label="Top area"
          title={topHood?.neighborhood ?? '—'}
          subtitle={topHood ? `${topHood.scanRate}% scan rate` : ''}
        />
        <HighlightCard
          icon={Clock}
          label="Best time"
          title={bestTime.bucket}
          subtitle={bestTime.window}
        />
      </div>

      <BenchmarkRows data={benchmark} />

      <SmartAlerts />

      <BrandLeaderboard rows={leaderboard} />
    </div>
  );
}
