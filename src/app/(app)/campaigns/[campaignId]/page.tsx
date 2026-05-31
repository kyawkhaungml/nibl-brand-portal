import { notFound } from 'next/navigation';
import { kaceMockData } from '@/lib/mock-data';
import { getCurrentBrandId } from '@/lib/brand';
import { getDrinkVariants } from '@/lib/api/pairing-insights';
import {
  getCampaignById,
  getCampaignNeighborhoods,
  getGeoBreakdown,
  getSamplesUsedForCampaign,
} from '@/lib/api/campaigns';
import { CampaignsClient } from './campaigns-client';
import { PendingOrUnknown } from './pending-or-unknown';

export default async function CampaignDetailPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const brandId = await getCurrentBrandId();
  const campaign = await getCampaignById(brandId, params.campaignId);

  // Not a seeded campaign — could be a user-created pending one (lives in
  // localStorage), so defer to a client component that reads from there.
  if (!campaign) {
    return <PendingOrUnknown id={params.campaignId} />;
  }

  const [hoods, samplesUsed, variants, geo] = await Promise.all([
    getCampaignNeighborhoods(campaign.id),
    getSamplesUsedForCampaign(campaign.id),
    getDrinkVariants(brandId),
    getGeoBreakdown(brandId),
  ]);

  return (
    <CampaignsClient
      campaign={campaign}
      hoods={hoods}
      variants={variants}
      geo={geo}
      samplesUsed={samplesUsed}
      scanRate={kaceMockData.summary.scanRate}
      topCombos={kaceMockData.foodCombos.slice(0, 5)}
      timeOfDay={kaceMockData.timeOfDay}
      summary={kaceMockData.summary}
    />
  );
}

// Make 404 explicit for the type-checker even though notFound() is used inside
// PendingOrUnknown when neither seed nor localStorage match.
export const dynamic = 'force-dynamic';
void notFound;
