import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BrandRanking } from '@/types';

function rankSuffix(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function BrandLeaderboard({ rows }: { rows: BrandRanking[] }) {
  const you = rows.find((r) => r.isYou);
  const top = rows[0];
  return (
    <div className="nibl-card overflow-hidden">
      <div className="border-b border-foreground p-5">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Trophy className="h-4 w-4 text-accent" />
          Top brands on NiBL this month
        </div>
        {you && top ? (
          <p className="mt-2 text-sm text-foreground">
            You&apos;re ranked{' '}
            <span className="font-semibold text-accent">
              #{you.rank}
              {rankSuffix(you.rank)}
            </span>
            {you.rank === 1 ? (
              <> — keep it up.</>
            ) : (
              <>
                {' '}
                — {(top.pairings - you.pairings).toLocaleString()} pairings
                behind <span className="font-medium">{top.brand}</span>.
              </>
            )}
          </p>
        ) : null}
      </div>
      <ol>
        {rows.map((r) => (
          <li
            key={r.brand}
            className={cn(
              'grid grid-cols-[2rem_minmax(0,1.5fr)_minmax(0,1fr)_60px_60px_60px] items-center gap-3 border-b border-border px-5 py-3 last:border-b-0',
              r.isYou && 'bg-accent/10',
            )}
          >
            <span className="text-right text-sm tabular-nums text-muted-foreground">
              {r.rank}.
            </span>
            <div className="min-w-0">
              <div
                className={cn(
                  'truncate text-sm',
                  r.isYou ? 'font-semibold text-accent' : 'text-foreground',
                )}
              >
                {r.brand}
                {r.isYou ? (
                  <span className="ml-2 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-accent">
                    you
                  </span>
                ) : null}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {r.category}
              </div>
            </div>
            <span className="hidden truncate text-xs text-muted-foreground sm:block" />
            <span className="text-right text-sm tabular-nums text-foreground">
              {r.pairings.toLocaleString()}
            </span>
            <span className="text-right text-sm tabular-nums text-muted-foreground">
              {r.scanRate}%
            </span>
            <span className="text-right text-sm tabular-nums text-muted-foreground">
              {r.avgRating.toFixed(1)}★
            </span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-[2rem_minmax(0,1.5fr)_minmax(0,1fr)_60px_60px_60px] gap-3 border-t border-border px-5 py-2 text-[10px] uppercase tracking-wide text-muted-foreground">
        <span />
        <span>Brand</span>
        <span />
        <span className="text-right">Pairings</span>
        <span className="text-right">Scan</span>
        <span className="text-right">Rating</span>
      </div>
    </div>
  );
}
