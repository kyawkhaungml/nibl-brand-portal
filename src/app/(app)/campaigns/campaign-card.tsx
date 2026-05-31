import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import type { BrandCampaign, CampaignStatus } from '@/types';

const STATUS: Record<
  CampaignStatus,
  { label: string; variant: 'success' | 'warning' | 'default' | 'accent' }
> = {
  active: { label: 'Active', variant: 'success' },
  pending: { label: 'Pending review', variant: 'accent' },
  paused: { label: 'Paused', variant: 'warning' },
  completed: { label: 'Completed', variant: 'default' },
};

export function CampaignCard({
  campaign,
  samplesUsed,
}: {
  campaign: BrandCampaign;
  samplesUsed: number;
}) {
  const s = STATUS[campaign.status];
  const pct = campaign.totalBudget
    ? Math.min(100, (samplesUsed / campaign.totalBudget) * 100)
    : 0;

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className={cn(
        'nibl-card group block p-5 transition-all',
        'hover:-translate-y-px hover:shadow-flat-lg',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-heading text-lg leading-tight text-foreground">
            {campaign.name}
          </div>
          <div className="mt-0.5 text-sm text-foreground">
            {campaign.drinkName}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {campaign.startDate} → {campaign.endDate ?? 'ongoing'}
          </div>
        </div>
        <Badge variant={s.variant} className="uppercase">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {s.label}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            <span className="text-foreground tabular-nums">
              {samplesUsed.toLocaleString()}
            </span>{' '}
            / {campaign.totalBudget.toLocaleString()} samples
          </span>
          <span className="tabular-nums text-muted-foreground">
            {Math.round(pct)}%
          </span>
        </div>
        <ProgressBar
          value={pct}
          tone={campaign.status === 'active' ? 'accent' : 'muted'}
        />
      </div>

      <div className="mt-4 flex items-center justify-end text-[12px] font-medium text-accent">
        View campaign{' '}
        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
