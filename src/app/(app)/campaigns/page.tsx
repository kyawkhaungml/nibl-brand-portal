import { kaceMockData } from '@/lib/mock-data';
import { getCurrentBrandId } from '@/lib/brand';
import { getDrinkVariants } from '@/lib/api/pairing-insights';
import {
  getActiveCampaign,
  getCampaignNeighborhoods,
  getCampaignTimeline,
  getSamplesUsed,
} from '@/lib/api/campaigns';
import { CampaignsClient } from './campaigns-client';

export default async function CampaignsPage() {
  const brandId = await getCurrentBrandId();
  const campaign = await getActiveCampaign(brandId);
  if (!campaign) {
    return (
      <div className="nibl-card p-6 text-sm text-muted-foreground">
        Your campaign data will appear here once NiBL begins distributing your
        product.
      </div>
    );
  }

  const [timeline, hoods, samplesUsed, variants] = await Promise.all([
    getCampaignTimeline(campaign.id),
    getCampaignNeighborhoods(campaign.id),
    getSamplesUsed(campaign.id),
    getDrinkVariants(brandId),
  ]);

  return (
    <CampaignsClient
      campaign={campaign}
      timeline={timeline}
      hoods={hoods}
      variants={variants}
      samplesUsed={samplesUsed}
      scanRate={kaceMockData.summary.scanRate}
      topCombos={kaceMockData.foodCombos.slice(0, 5)}
      timeOfDay={kaceMockData.timeOfDay}
      summary={kaceMockData.summary}
    />
  );
}
