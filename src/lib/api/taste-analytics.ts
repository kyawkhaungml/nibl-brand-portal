import 'server-only';

import { env } from '@/lib/env';
import { kaceMockData } from '@/lib/mock-data';
import type { TasteAnalytics } from '@/types';

export async function getTasteAnalytics(_brandId: string): Promise<TasteAnalytics> {
  if (env.useMockData) {
    return {
      dimensions: kaceMockData.tasteDimensions,
      segments: kaceMockData.customerSegments,
      repeat: kaceMockData.repeat,
      demographics: kaceMockData.demographics,
    };
  }
  // TODO(v2): aggregate customer_icp rows for users who received this brand's drink,
  // joined via product_pairings → orders.user_id → customer_icp.user_id.
  // Most taste dimensions (sweet/citrus/carbonation/umami/bold) require populating
  // the new customer_icp columns added in 2026-05-28_brand_portal_schema.sql.
  throw new Error('Real data wiring not implemented; set NEXT_PUBLIC_USE_MOCK_DATA=true.');
}
