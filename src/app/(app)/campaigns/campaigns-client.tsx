'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AISummaryCard } from '@/components/cards/ai-summary-card';
import { CampaignProgress } from '@/components/cards/campaign-progress';
import { KPICard } from '@/components/cards/kpi-card';
import { VariantBreakdown } from '@/components/cards/variant-breakdown';
import { RequestResupplyTrigger } from '@/components/campaigns/request-resupply-modal';
import { AICampaignReportButton } from '@/components/campaigns/ai-campaign-report-button';
import { USPerformanceMap } from '@/components/campaigns/us-performance-map';
import { StateIcpSnapshot } from '@/components/campaigns/state-icp-snapshot';
import { GeoBreakdownDrilldown } from '@/components/campaigns/geo-breakdown-drilldown';
import type {
  BrandCampaign,
  DrinkVariantPerformance,
  FoodCombo,
  NeighborhoodPerformance,
  PairingSummary,
  StatePerformance,
  TimeOfDayBucket,
} from '@/types';

export function CampaignsClient({
  campaign,
  hoods,
  variants,
  geo,
  samplesUsed,
  scanRate,
  topCombos,
  timeOfDay,
  summary,
}: {
  campaign: BrandCampaign;
  hoods: NeighborhoodPerformance[];
  variants: DrinkVariantPerformance[];
  geo: StatePerformance[];
  samplesUsed: number;
  scanRate: number;
  topCombos: FoodCombo[];
  timeOfDay: TimeOfDayBucket[];
  summary: PairingSummary;
}) {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const samplesRemaining = Math.max(0, campaign.totalBudget - samplesUsed);
  const totalSpend = samplesUsed * campaign.costPerSample;
  const scans = Math.round(samplesUsed * (scanRate / 100));
  const cpe = scans ? totalSpend / scans : 0;

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

      <USPerformanceMap
        states={geo}
        selectedState={selectedState}
        onSelectState={setSelectedState}
      />

      <StateIcpSnapshot states={geo} selectedState={selectedState} />

      <GeoBreakdownDrilldown
        states={geo}
        selectedState={selectedState}
        onSelectState={setSelectedState}
        onClearState={() => setSelectedState(null)}
      />

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
