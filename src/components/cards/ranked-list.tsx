import { cn } from '@/lib/utils';

export type RankedRow = {
  primary: string;       // e.g. "East Village"
  secondary?: string;    // e.g. "264 deliveries"
  trailing?: string;     // e.g. "75% scan"
  dot?: 'green' | 'amber' | 'red' | null;
};

export function RankedList({
  rows,
  caption,
  className,
}: {
  rows: RankedRow[];
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn('nibl-card', className)}>
      {caption ? (
        <div className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
          {caption}
        </div>
      ) : null}
      <ol>
        {rows.map((row, i) => (
          <li
            key={i}
            className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-b-0"
          >
            <span className="w-5 text-right tabular-nums text-sm text-muted-foreground">
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm text-foreground">{row.primary}</div>
              {row.secondary ? (
                <div className="text-xs text-muted-foreground">{row.secondary}</div>
              ) : null}
            </div>
            {row.trailing ? (
              <span className="text-sm text-muted-foreground tabular-nums">
                {row.trailing}
              </span>
            ) : null}
            {row.dot ? (
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  row.dot === 'green' && 'bg-success',
                  row.dot === 'amber' && 'bg-accent',
                  row.dot === 'red' && 'bg-destructive',
                )}
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
