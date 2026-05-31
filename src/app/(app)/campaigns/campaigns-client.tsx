'use client';

import { Button } from '@/components/ui/button';
import { AreaChart } from '@/components/charts/area-chart';
import { AISummaryCard } from '@/components/cards/ai-summary-card';
import { CampaignProgress } from '@/components/cards/campaign-progress';
import { KPICard } from '@/components/cards/kpi-card';
import { RankedList, type RankedRow } from '@/components/cards/ranked-list';
import { VariantBreakdown } from '@/components/cards/variant-breakdown';
import { RequestResupplyTrigger } from '@/components/campaigns/request-resupply-modal';
import { AICampaignReportButton } from '@/components/campaigns/ai-campaign-report-button';
import type {
  BrandCampaign,
  CampaignTimelinePoint,
  DrinkVariantPerformance,
  FoodCombo,
  NeighborhoodPerformance,
  PairingSummary,
  TimeOfDayBucket,
} from '@/types';

function dotFor(scanRate: number): RankedRow['dot'] {
  if (scanRate >= 70) return 'green';
  if (scanRate >= 50) return 'amber';
  return 'red';
}

export function CampaignsClient({
  campaign,
  timeline,
  hoods,
  variants,
  samplesUsed,
  scanRate,
  topCombos,
  timeOfDay,
  summary,
}: {
  campaign: BrandCampaign;
  timeline: CampaignTimelinePoint[];
  hoods: NeighborhoodPerformance[];
  variants: DrinkVariantPerformance[];
  samplesUsed: number;
  scanRate: number;
  topCombos: FoodCombo[];
  timeOfDay: TimeOfDayBucket[];
  summary: PairingSummary;
}) {
  const samplesRemaining = Math.max(0, campaign.totalBudget - samplesUsed);
  const totalSpend = samplesUsed * campaign.costPerSample;
  const scans = Math.round(samplesUsed * (scanRate / 100));
  const cpe = scans ? totalSpend / scans : 0;

  const rankedHoods: RankedRow[] = hoods
    .slice()
    .sort((a, b) => b.pairings - a.pairings)
    .slice(0, 5)
    .map((h) => ({
      primary: h.neighborhood,
      secondary: `${h.pairings.toLocaleString()} deliveries`,
      trailing: `${h.scanRate}% scan`,
      dot: dotFor(h.scanRate),
    }));

  return (
    <div className="space-y-6">
      <CampaignProgress campaign={campaign} samplesUsed={samplesUsed} />

      <RequestResupplyTrigger />

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          label="Cost per engagement"
          value={`$${cpe.toFixed(2)}`}
          hint="spend ÷ scans"
        />
        <KPICard label="Total invested" value={`$${totalSpend.toFixed(0)}`} />
        <KPICard
          label="Samples remaining"
          value={samplesRemaining.toLocaleString()}
        />
      </div>

      <VariantBreakdown variants={variants} totalPairings={samplesUsed} />

      <div className="nibl-card p-5">
        <div className="mb-3 text-sm font-medium text-foreground">
          Campaign timeline
        </div>
        <AreaChart
          data={timeline.map((p) => ({
            date: p.date.slice(5),
            pairings: p.samples,
          }))}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Average{' '}
          <span className="font-medium text-foreground">{scanRate}%</span> of
          recipients scan the QR code.
        </p>
      </div>

      <RankedList rows={rankedHoods} caption="Geographic breakdown" />

      <AISummaryCard
        endpoint="/api/insight/campaign-summary"
        payload={{
          campaign,
          summary,
          variants,
          topNeighborhoods: hoods,
          topCombos,
          timeOfDay,
        }}
        title="Campaign insight"
      />

      <AICampaignReportButton />

      <div className="nibl-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-foreground">
            Campaign settings
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Budget {campaign.totalBudget.toLocaleString()} samples ·{' '}
            {samplesRemaining.toLocaleString()} remaining
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="mailto:partners@nibl.food">Contact NiBL team</a>
        </Button>
      </div>
    </div>
  );
}
