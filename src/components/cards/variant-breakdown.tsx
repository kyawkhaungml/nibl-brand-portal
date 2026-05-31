'use client';

import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type { DrinkVariantPerformance } from '@/types';

function withTransition(update: () => void) {
  type DocWithVT = Document & {
    startViewTransition?: (cb: () => void) => void;
  };
  const d = document as DocWithVT;
  if (typeof d.startViewTransition === 'function') {
    d.startViewTransition(update);
  } else {
    update();
  }
}

export function VariantBreakdown({
  variants,
  totalPairings,
}: {
  variants: DrinkVariantPerformance[];
  totalPairings: number;
}) {
  const toast = useToast();
  const defaultPrimary = useMemo(
    () =>
      [...variants].sort((a, b) => b.pairings - a.pairings)[0]?.variant ?? '',
    [variants],
  );
  const [primary, setPrimary] = useState<string>(defaultPrimary);

  const ordered = useMemo(() => {
    const primaryRow = variants.find((v) => v.variant === primary);
    const rest = [...variants]
      .filter((v) => v.variant !== primary)
      .sort((a, b) => b.pairings - a.pairings);
    return primaryRow ? [primaryRow, ...rest] : rest;
  }, [variants, primary]);

  function setAsPrimary(name: string) {
    withTransition(() => setPrimary(name));
    toast.show(
      `✓ ${name} set as primary variant. NiBL will prioritize this in future deliveries.`,
      'success',
    );
  }

  return (
    <div className="nibl-card overflow-hidden">
      <div className="border-b border-foreground p-5">
        <div className="text-sm font-medium text-foreground">
          Per-variant performance
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {variants.length} variants in this campaign · primary{' '}
          <span className="font-medium text-foreground">{primary}</span> sets the
          default supply priority.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {ordered.map((v) => {
          const share = totalPairings ? (v.pairings / totalPairings) * 100 : 0;
          const isPrimary = v.variant === primary;
          return (
            <li
              key={v.variant}
              className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[minmax(180px,1.2fr)_minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto] md:items-center"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'truncate text-sm font-medium',
                      isPrimary ? 'text-accent' : 'text-foreground',
                    )}
                  >
                    {v.variant}
                  </span>
                  {isPrimary ? (
                    <span
                      className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-medium"
                      style={{ backgroundColor: '#FFF3DC', color: '#B86E00' }}
                    >
                      <Star className="h-2.5 w-2.5 fill-current" /> Primary
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground">
                  {v.pairings.toLocaleString()} pairings · {share.toFixed(0)}% of
                  total
                </div>
              </div>
              <ProgressBar value={share} tone={isPrimary ? 'accent' : 'muted'} />
              <Stat label="Scan rate" value={`${v.scanRate}%`} />
              <Stat label="Avg rating" value={`${v.avgRating.toFixed(1)}★`} />
              <Stat label="Buy again" value={`${v.wouldBuyAgain}%`} />
              <div className="md:text-right">
                {!isPrimary ? (
                  <button
                    type="button"
                    onClick={() => setAsPrimary(v.variant)}
                    className="rounded-md border px-2.5 py-1 text-[10px] transition-colors hover:border-accent hover:text-accent"
                    style={{ borderColor: '#E0E0E0', color: '#6B7280' }}
                  >
                    Set as primary
                  </button>
                ) : null}
              </div>
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
      <div className="text-sm font-medium tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}
