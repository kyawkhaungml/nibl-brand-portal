'use client';

import { useRouter } from 'next/navigation';
import { Clock, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useUserCampaigns } from '@/lib/use-user-campaigns';
import type { BrandCampaign } from '@/types';

export function PendingCampaignView({ campaign }: { campaign: BrandCampaign }) {
  const router = useRouter();
  const toast = useToast();
  const { removeCampaign } = useUserCampaigns();

  const totalSpend = campaign.totalBudget * campaign.costPerSample;
  const extras = campaign.extras;

  function onDelete() {
    if (!window.confirm(`Delete "${campaign.name}"? This can't be undone.`)) {
      return;
    }
    removeCampaign(campaign.id);
    toast.show('Campaign deleted.', 'success');
    router.push('/campaigns');
  }

  return (
    <div className="space-y-6">
      <section className="nibl-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={() => router.push('/campaigns')}
              className="mb-2 inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
            >
              ← All campaigns
            </button>
            <h1 className="font-heading text-2xl text-foreground">
              {campaign.name}
            </h1>
            <p className="mt-1 text-sm text-foreground">{campaign.drinkName}</p>
            <p className="text-xs text-muted-foreground">
              {campaign.startDate} → {campaign.endDate ?? 'ongoing'}
            </p>
          </div>
          <Badge variant="warning" className="uppercase">
            <Clock className="mr-1 inline h-3 w-3" />
            Pending review
          </Badge>
        </div>
      </section>

      <section className="rounded-2xl border border-accent/40 bg-accent/10 p-6">
        <div className="text-sm font-medium text-foreground">
          Your NiBL account manager is reviewing this campaign
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          We&apos;ll reach out within 24 hours to confirm launch details and
          start distributing samples. You&apos;ll see live performance data
          here once the campaign goes live.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="nibl-card p-5">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Budget
          </div>
          <div className="mt-2 font-heading text-display-lg text-foreground">
            ${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {campaign.totalBudget.toLocaleString()} samples × $
            {campaign.costPerSample.toFixed(2)}
          </div>
        </div>
        <div className="nibl-card p-5">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Variants
          </div>
          <div className="mt-2 text-sm text-foreground">
            {campaign.drinkVariants.join(' · ')}
          </div>
        </div>
      </div>

      {extras ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="nibl-card p-5">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Promo code
            </div>
            <div className="mt-2 font-mono text-base font-semibold text-accent">
              {extras.promoCode || '—'}
            </div>
          </div>
          <div className="nibl-card p-5">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Target neighborhoods
            </div>
            <div className="mt-2 text-sm text-foreground">
              {extras.targetNeighborhoods.length
                ? extras.targetNeighborhoods.join(' · ')
                : 'No targets selected'}
            </div>
          </div>
          <div className="nibl-card p-5">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Notes
            </div>
            <div className="mt-2 text-sm text-foreground">
              {extras.notes?.trim() || '—'}
            </div>
          </div>
        </div>
      ) : null}

      <div className="nibl-card flex items-center justify-between p-5">
        <div>
          <div className="text-sm font-medium text-foreground">
            Delete this campaign
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Removes the campaign request from your portal. This can&apos;t be
            undone.
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete campaign
        </button>
      </div>
    </div>
  );
}
