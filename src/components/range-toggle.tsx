'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DateRange } from '@/types';

const RANGES: DateRange[] = ['7D', '30D', '90D'];

export function RangeToggle({ current }: { current: DateRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function set(range: DateRange) {
    const next = new URLSearchParams(params.toString());
    next.set('range', range);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="inline-flex rounded-full border border-foreground bg-card p-1 shadow-flat-sm">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => set(r)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            current === r
              ? 'bg-accent/15 text-accent'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
