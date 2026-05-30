import { getTasteAnalytics } from '@/lib/api/taste-analytics';
import { getPairingSummary } from '@/lib/api/pairing-insights';
import { getCurrentBrandId } from '@/lib/brand';
import { AudienceClient } from './audience-client';

export default async function TasteAnalyticsPage() {
  const brandId = await getCurrentBrandId();
  const [analytics, summary] = await Promise.all([
    getTasteAnalytics(brandId),
    getPairingSummary(brandId, '30D'),
  ]);
  return (
    <AudienceClient
      totalCustomers={summary.totalPairings}
      analytics={analytics}
    />
  );
}
