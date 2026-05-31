import 'server-only';

import { env } from '@/lib/env';
import { kaceMockData } from '@/lib/mock-data';
import type {
  BrandCampaign,
  CampaignBenchmark,
  CampaignTimelinePoint,
  NeighborhoodPerformance,
  StatePerformance,
} from '@/types';

export async function getActiveCampaign(_brandId: string): Promise<BrandCampaign | null> {
  if (env.useMockData) return kaceMockData.campaign;
  throw new Error('Real data wiring not implemented.');
}

export async function getCampaigns(_brandId: string): Promise<BrandCampaign[]> {
  if (env.useMockData) return kaceMockData.campaigns;
  throw new Error('Real data wiring not implemented.');
}

export async function getCampaignById(
  _brandId: string,
  id: string,
): Promise<BrandCampaign | null> {
  if (env.useMockData) {
    return kaceMockData.campaigns.find((c) => c.id === id) ?? null;
  }
  throw new Error('Real data wiring not implemented.');
}

/**
 * For completed seeded campaigns, samples used = the explicit number set on
 * the mock object. For the active one, fall back to `getSamplesUsed`.
 */
export async function getSamplesUsedForCampaign(
  campaignId: string,
): Promise<number> {
  if (env.useMockData) {
    const c = kaceMockData.campaigns.find((c) => c.id === campaignId);
    if (c?.samplesUsed != null) return c.samplesUsed;
    return kaceMockData.summary.totalPairings;
  }
  throw new Error('Real data wiring not implemented.');
}

export async function getCampaignTimeline(
  _campaignId: string,
): Promise<CampaignTimelinePoint[]> {
  if (env.useMockData) return kaceMockData.campaignTimeline;
  throw new Error('Real data wiring not implemented.');
}

export async function getBenchmark(_brandId: string): Promise<CampaignBenchmark[]> {
  if (env.useMockData) return kaceMockData.benchmark;
  throw new Error('Real data wiring not implemented.');
}

export async function getCampaignNeighborhoods(
  _campaignId: string,
): Promise<NeighborhoodPerformance[]> {
  if (env.useMockData) return kaceMockData.neighborhoods;
  throw new Error('Real data wiring not implemented.');
}

export async function getSamplesUsed(_campaignId: string): Promise<number> {
  if (env.useMockData) return kaceMockData.summary.totalPairings;
  throw new Error('Real data wiring not implemented.');
}

export async function getGeoBreakdown(_brandId: string): Promise<StatePerformance[]> {
  if (env.useMockData) return kaceMockData.geoBreakdown;
  // TODO(v2): query clustering-model predicted ICP keyed by state +
  // join product_pairings (currently NY only) for the active row.
  throw new Error('Real data wiring not implemented.');
}
