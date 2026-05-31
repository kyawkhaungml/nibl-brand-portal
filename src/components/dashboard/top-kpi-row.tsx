import { BigKPICard } from './big-kpi-card';
import { FlavorShareDonut } from './flavor-share-donut';
import type { CodeAttribution, DrinkVariantPerformance } from '@/types';

function formatUsd(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 10_000) {
    return `$${(dollars / 1000).toFixed(1)}K`;
  }
  return `$${dollars.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function TopKpiRow({
  variants,
  attribution,
  avgOrderValue,
}: {
  variants: DrinkVariantPerformance[];
  attribution: CodeAttribution;
  avgOrderValue: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FlavorShareDonut variants={variants} />
      <BigKPICard
        label="Avg conversion rate"
        value={`${attribution.conversionRate.toFixed(1)}%`}
        sub={
          <>
            {attribution.redemptions.toLocaleString()} orders used{' '}
            <span className="font-medium text-foreground">
              {attribution.promoCode}
            </span>
          </>
        }
      />
      <BigKPICard
        label="Revenue via NiBL"
        value={formatUsd(attribution.revenueCents)}
        sub={
          <>
            {attribution.totalOrders.toLocaleString()} orders · $
            {avgOrderValue.toFixed(2)} avg
          </>
        }
      />
    </div>
  );
}
