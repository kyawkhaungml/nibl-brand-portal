import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import type { TasteDimension } from '@/types';

export function TasteList({ items }: { items: TasteDimension[] }) {
  const sorted = [...items].sort((a, b) => b.score - a.score);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return (
    <div className="nibl-card p-5">
      <div className="mb-4 text-sm font-medium text-foreground">
        Taste preferences
      </div>
      <div className="space-y-3.5">
        {items.map((d) => {
          const isHigh = d.key === highest?.key;
          const isLow = d.key === lowest?.key;
          return (
            <div
              key={d.key}
              className="grid grid-cols-[minmax(140px,1fr)_minmax(120px,2fr)_56px] items-center gap-3 text-sm"
            >
              <div className="flex items-center gap-2 text-foreground">
                <span>{d.label}</span>
                {isHigh ? (
                  <span className="text-[10px] uppercase tracking-wide text-accent">
                    highest
                  </span>
                ) : null}
                {isLow ? (
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    lowest
                  </span>
                ) : null}
              </div>
              <ProgressBar value={d.score} tone={isHigh ? 'accent' : 'muted'} />
              <div
                className={cn(
                  'text-right tabular-nums',
                  isHigh && 'text-accent',
                  isLow && 'text-muted-foreground',
                  !isHigh && !isLow && 'text-foreground',
                )}
              >
                {Math.round(d.score)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
