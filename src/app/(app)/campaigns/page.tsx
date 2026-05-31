import { getCurrentBrandId } from '@/lib/brand';
import { getCampaigns } from '@/lib/api/campaigns';
import { CampaignList } from './campaign-list';

export default async function CampaignsListPage() {
  const brandId = await getCurrentBrandId();
  const seeded = await getCampaigns(brandId);
  return <CampaignList seededCampaigns={seeded} />;
}
