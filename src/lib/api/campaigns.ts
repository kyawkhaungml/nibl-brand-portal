import 'server-only';

import { env } from '@/lib/env';
import { kaceMockData } from '@/lib/mock-data';
import type {
  BrandCampaign,
  CampaignBenchmark,
  CampaignTimelinePoint,
  NeighborhoodPerformance,
} from '@/types';

export async function getActiveCampaign(_brandId: string): Promise<BrandCampaign | null> {
  if (env.useMockData) return kaceMockData.campaign;
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
