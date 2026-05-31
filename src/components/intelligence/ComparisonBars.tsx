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

function SingleBar({ item }: { item: Comparison }) {
  const left = Math.max(0, Math.min(100, item.leftPct));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-foreground">
          {item.leftLabel}{' '}
          <span className="font-semibold text-accent">{item.leftPct}%</span>
        </span>
        <span className="text-foreground">
          <span className="font-semibold text-accent">{item.rightPct}%</span>{' '}
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
