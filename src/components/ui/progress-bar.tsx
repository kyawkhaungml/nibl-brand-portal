import { cn } from '@/lib/utils';

type Tone = 'accent' | 'success' | 'muted';

export function ProgressBar({
  value,
  tone = 'accent',
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('nibl-progress', className)}>
      <div
        className={cn(
          'nibl-progress-fill',
          tone === 'success' && 'nibl-progress-fill--success',
          tone === 'muted' && 'nibl-progress-fill--muted',
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
