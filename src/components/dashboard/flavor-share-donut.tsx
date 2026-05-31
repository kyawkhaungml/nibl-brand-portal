'use client';

import { DonutChart } from '@/components/charts/donut-chart';
import type { DrinkVariantPerformance } from '@/types';

const COLORS = ['#FF5C25', '#0EA5E9', '#A855F7', '#10B981', '#F59E0B'];

export function FlavorShareDonut({
  variants,
}: {
  variants: DrinkVariantPerformance[];
}) {
  const total = variants.reduce((s, v) => s + v.pairings, 0) || 1;
  const data = variants
    .slice()
    .sort((a, b) => b.pairings - a.pairings)
    .map((v) => ({
      name: v.variant,
      value: Math.round((v.pairings / total) * 1000) / 10, // 1dp %
    }));

  return (
    <div className="nibl-card flex flex-col p-6">
      <div className="text-sm font-medium text-foreground">Flavor share</div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Share of customer pairings
      </p>

      <div className="mt-2 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_minmax(140px,auto)]">
        <div>
          <DonutChart
            data={data}
            height={220}
            innerRadius={56}
            outerRadius={92}
            colors={COLORS}
          />
        </div>
        <ul className="space-y-1.5 text-sm">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-foreground">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="truncate">{d.name}</span>
              </span>
              <span className="tabular-nums text-muted-foreground">
                {d.value.toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
