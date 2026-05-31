import type { Comparison } from '@/lib/intelligence/types';

export function ComparisonBars({ items }: { items: Comparison[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-3">
      {items.map((c, i) => (
        <SingleBar key={i} item={c} />
      ))}
    </div>
  );
}

// Scale a pair of raw percentages so they sum to exactly 100. The displayed
// value AND the bar fill width both use the normalized number, so the visual
// is always honest even when Claude returns two independent fit scores that
// don't naturally sum to 100.
function normalizePair(rawLeft: number, rawRight: number): { left: number; right: number } {
  const sum = rawLeft + rawRight;
  if (sum <= 0) return { left: 50, right: 50 };
  const l = Math.round((rawLeft / sum) * 100);
  return { left: l, right: 100 - l };
}

function SingleBar({ item }: { item: Comparison }) {
  const { left, right } = normalizePair(item.leftPct, item.rightPct);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-foreground">
          {item.leftLabel}{' '}
          <span className="font-semibold text-accent">{left}%</span>
        </span>
        <span className="text-foreground">
          <span className="font-semibold text-accent">{right}%</span>{' '}
          {item.rightLabel}
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full border border-foreground bg-muted">
        <div
          className="h-full bg-accent"
          style={{ width: `${left}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
