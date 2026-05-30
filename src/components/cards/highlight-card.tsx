import type { LucideIcon } from 'lucide-react';

export function HighlightCard({
  icon: Icon,
  label,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="nibl-card p-5">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Icon className="h-4 w-4 text-accent" />
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
    </div>
  );
}
