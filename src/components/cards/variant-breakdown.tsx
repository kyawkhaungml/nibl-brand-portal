import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import type { DrinkVariantPerformance } from '@/types';

export function VariantBreakdown({
  variants,
  totalPairings,
}: {
  variants: DrinkVariantPerformance[];
  totalPairings: number;
}) {
  const sorted = [...variants].sort((a, b) => b.pairings - a.pairings);
  const best = sorted[0];

  return (
    <div className="nibl-card overflow-hidden">
      <div className="border-b border-foreground p-5">
        <div className="text-sm font-medium text-foreground">Per-variant performance</div>
        <p className="mt-1 text-xs text-muted-foreground">
          {variants.length} variants in this campaign · top performer{' '}
          <span className="font-medium text-foreground">{best?.variant}</span>{' '}
          with {best?.pairings.toLocaleString()} pairings.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {sorted.map((v, i) => {
          const share = totalPairings ? (v.pairings / totalPairings) * 100 : 0;
          return (
            <li
              key={v.variant}
              className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[minmax(160px,1.2fr)_minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] md:items-center"
            >
              <div>
                <div
                  className={cn(
                    'text-sm font-medium',
                    i === 0 ? 'text-accent' : 'text-foreground',
                  )}
                >
                  {v.variant}
                </div>
                <div className="text-xs text-muted-foreground">
                  {v.pairings.toLocaleString()} pairings · {share.toFixed(0)}% of total
                </div>
              </div>
              <ProgressBar value={share} tone={i === 0 ? 'accent' : 'muted'} />
              <Stat label="Scan rate" value={`${v.scanRate}%`} />
              <Stat label="Avg rating" value={`${v.avgRating.toFixed(1)}★`} />
              <Stat label="Buy again" value={`${v.wouldBuyAgain}%`} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-left md:text-right">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium tabular-nums text-foreground">{value}</div>
    </div>
  );
}
