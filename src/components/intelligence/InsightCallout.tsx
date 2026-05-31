import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InsightCallout({
  tone,
  label,
  items,
}: {
  tone: 'positive' | 'caution';
  label: string;
  items: string[];
}) {
  if (!items.length) return null;
  const Icon = tone === 'positive' ? CheckCircle2 : AlertTriangle;
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        tone === 'positive'
          ? 'border-success/40 bg-success/10'
          : 'border-accent/40 bg-accent/10',
      )}
    >
      <div
        className={cn(
          'mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wide',
          tone === 'positive' ? 'text-success' : 'text-accent',
        )}
      >
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <ul className="space-y-1 text-[12px] leading-relaxed text-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
