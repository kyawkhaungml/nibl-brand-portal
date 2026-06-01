import { cn } from '@/lib/utils';

export function BigKPICard({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('nibl-card flex flex-col p-8', className)}>
      <div className="text-[18px] font-medium text-foreground">{label}</div>
      <div className="flex flex-1 items-center justify-center py-4">
        <div className="font-heading text-display-3xl leading-none text-foreground text-center">
          {value}
        </div>
      </div>
      {sub ? (
        <div className="text-[12px] text-muted-foreground">{sub}</div>
      ) : null}
    </div>
  );
}
