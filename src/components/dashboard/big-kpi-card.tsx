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
    <div className={cn('nibl-card flex flex-col justify-between p-7', className)}>
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="font-heading text-display-3xl leading-none text-foreground">
        {value}
      </div>
      {sub ? <div className="text-[12px] text-muted-foreground">{sub}</div> : null}
    </div>
  );
}
