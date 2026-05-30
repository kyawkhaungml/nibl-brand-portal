import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KPICard({
  label,
  value,
  delta,
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  className?: string;
}) {
  const showDelta = typeof delta === 'number';
  const positive = showDelta && delta! > 0;
  const negative = showDelta && delta! < 0;
  return (
    <div className={cn('nibl-card p-5', className)}>
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="mt-2 font-heading text-display-xl leading-none text-foreground">
        {value}
      </div>
      {showDelta ? (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-[12px]',
            positive && 'text-success',
            // Below-target trend reads as accent (actionable), never red.
            negative && 'text-accent',
            !positive && !negative && 'text-muted-foreground',
          )}
        >
          {positive ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : negative ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          <span>
            {delta! > 0 ? '+' : ''}
            {delta!.toFixed(1)}% vs prior
          </span>
        </div>
      ) : null}
      {hint ? (
        <div className="mt-2 text-[12px] text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  );
}
