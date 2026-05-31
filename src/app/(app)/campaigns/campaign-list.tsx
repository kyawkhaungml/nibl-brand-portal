'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { CampaignCard } from './campaign-card';
import { CreateCampaignModal } from './create-campaign-modal';
import { useUserCampaigns } from '@/lib/use-user-campaigns';
import type { BrandCampaign, CampaignStatus } from '@/types';

const STATUS_ORDER: Record<CampaignStatus, number> = {
  pending: 0,
  active: 1,
  paused: 2,
  completed: 3,
};

const SECTION_TITLE: Record<CampaignStatus, string> = {
  pending: 'Pending review',
  active: 'Active',
  paused: 'Paused',
  completed: 'Past campaigns',
};

function samplesFor(c: BrandCampaign, summaryFallback: number): number {
  if (c.samplesUsed != null) return c.samplesUsed;
  if (c.status === 'pending') return 0;
  return summaryFallback;
}

export function CampaignList({
  seededCampaigns,
}: {
  seededCampaigns: BrandCampaign[];
}) {
  const { userCampaigns } = useUserCampaigns();
  const [createOpen, setCreateOpen] = useState(false);

  // Merge; user campaigns take precedence on id collision.
  const all = useMemo(() => {
    const map = new Map<string, BrandCampaign>();
    seededCampaigns.forEach((c) => map.set(c.id, c));
    userCampaigns.forEach((c) => map.set(c.id, c));
    return [...map.values()].sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        b.startDate.localeCompare(a.startDate),
    );
  }, [seededCampaigns, userCampaigns]);

  const totalActive = all.filter((c) => c.status === 'active').length;
  const totalSpend = all.reduce((sum, c) => {
    const used = samplesFor(c, 847);
    return sum + used * c.costPerSample;
  }, 0);
  const totalSamples = all.reduce(
    (sum, c) => sum + samplesFor(c, 847),
    0,
  );

  // Group by status for the section headers.
  const grouped = all.reduce<Record<CampaignStatus, BrandCampaign[]>>(
    (acc, c) => {
      (acc[c.status] ||= []).push(c);
      return acc;
    },
    { active: [], pending: [], paused: [], completed: [] },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-display-xl text-foreground">
            My campaigns
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse your campaigns or launch a new one.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-foreground bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground shadow-flat transition-all hover:-translate-y-px hover:shadow-flat-lg"
        >
          <Plus className="h-4 w-4" />
          New campaign
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiStat label="Active campaigns" value={totalActive.toString()} />
        <KpiStat
          label="Total spend"
          value={`$${totalSpend.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
        />
        <KpiStat
          label="Samples distributed"
          value={totalSamples.toLocaleString()}
        />
      </div>

      {(['pending', 'active', 'paused', 'completed'] as CampaignStatus[]).map(
        (status) => {
          const list = grouped[status];
          if (!list?.length) return null;
          return (
            <section key={status} className="space-y-3">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {SECTION_TITLE[status]}
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.map((c) => (
                  <CampaignCard
                    key={c.id}
                    campaign={c}
                    samplesUsed={samplesFor(c, 847)}
                  />
                ))}
              </div>
            </section>
          );
        },
      )}

      <CreateCampaignModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}

function KpiStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="nibl-card p-5">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="mt-2 font-heading text-display-xl leading-none text-foreground">
        {value}
      </div>
    </div>
  );
}
