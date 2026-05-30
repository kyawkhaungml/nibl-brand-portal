import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { BrandCampaign } from '@/types';

function statusVariant(s: string): 'success' | 'warning' | 'default' {
  if (s === 'active') return 'success';
  if (s === 'paused') return 'warning';
  return 'default';
}

export function CampaignProgress({
  campaign,
  samplesUsed,
}: {
  campaign: BrandCampaign;
  samplesUsed: number;
}) {
  const pct = campaign.totalBudget
    ? Math.min(100, (samplesUsed / campaign.totalBudget) * 100)
    : 0;
  return (
    <section className="nibl-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">{campaign.name}</h1>
          <p className="mt-1 text-sm text-foreground">{campaign.drinkName}</p>
          <p className="text-xs text-muted-foreground">
            {campaign.startDate} → {campaign.endDate ?? 'ongoing'}
          </p>
        </div>
        <Badge variant={statusVariant(campaign.status)} className="uppercase">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {campaign.status}
        </Badge>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="text-foreground tabular-nums">
              {samplesUsed.toLocaleString()}
            </span>{' '}
            / {campaign.totalBudget.toLocaleString()} samples used
          </span>
          <span className="text-muted-foreground tabular-nums">{Math.round(pct)}%</span>
        </div>
        <ProgressBar value={pct} tone="accent" />
      </div>
    </section>
  );
}
