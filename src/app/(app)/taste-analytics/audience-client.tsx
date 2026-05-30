'use client';

import { AISummaryCard } from '@/components/cards/ai-summary-card';
import { DonutChart } from '@/components/charts/donut-chart';
import { donutPalette } from '@/components/charts/donut-palette';
import { KPICard } from '@/components/cards/kpi-card';
import { RankedList, type RankedRow } from '@/components/cards/ranked-list';
import { TasteList } from '@/components/cards/taste-list';
import type { TasteAnalytics } from '@/types';

export function AudienceClient({
  totalCustomers,
  analytics,
}: {
  totalCustomers: number;
  analytics: TasteAnalytics;
}) {
  const segments = [...analytics.segments].sort((a, b) => b.share - a.share);
  const topThree = segments.slice(0, 3);
  const restShare = segments.slice(3).reduce((sum, s) => sum + s.share, 0);
  const donutData = restShare > 0
    ? [...topThree, { name: 'Other', share: restShare }]
    : topThree;

  const cuisineRows: RankedRow[] = analytics.demographics.topCuisines
    .slice(0, 5)
    .map((c) => ({
      primary: c.cuisine,
      trailing: `${c.orders.toLocaleString()} orders`,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">
          Here&apos;s who&apos;s been drinking your product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on {totalCustomers.toLocaleString()} NiBL customers who received
          your drink this month.
        </p>
      </div>

      <TasteList items={analytics.dimensions} />

      <div className="nibl-card p-5">
        <div className="mb-3 text-sm font-medium text-foreground">
          Customer type breakdown
        </div>
        <div className="flex flex-col items-center gap-5">
          <DonutChart
            data={donutData.map((s) => ({ name: s.name, value: s.share }))}
          />
          <ul className="grid w-full max-w-md grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
            {donutData.map((s, i) => (
              <li
                key={s.name}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: donutPalette[i % donutPalette.length],
                    }}
                  />
                  {s.name}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {s.share}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <KPICard
          label="Come back rate"
          value={`${analytics.repeat.repeatRate}%`}
          hint="ordered again within 30 days"
        />
        <KPICard
          label="Days to reorder"
          value={analytics.repeat.avgDaysBetween.toFixed(1)}
          hint="first pairing → next order"
        />
      </div>

      <RankedList rows={cuisineRows} caption="Top cuisines ordered with your drink" />

      <AISummaryCard
        endpoint="/api/insight/taste"
        payload={analytics}
        title="Audience insight"
      />
    </div>
  );
}
