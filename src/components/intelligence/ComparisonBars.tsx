import type { Comparison } from '@/lib/intelligence/types';

export function ComparisonBars({ items }: { items: Comparison[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      {items.map((c, i) => (
        <ComparisonRow key={i} item={c} />
      ))}
    </div>
  );
}

function ComparisonRow({ item }: { item: Comparison }) {
  return (
    <div className="space-y-2">
      <ScoreBar label={item.leftLabel} value={item.leftPct} />
      <ScoreBar label={item.rightLabel} value={item.rightPct} />
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-accent">
          {Math.round(value)}%
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full border border-foreground bg-muted">
        <div
          className="h-full bg-accent"
          style={{ width: `${clamped}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
