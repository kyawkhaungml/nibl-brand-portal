import { NextResponse } from 'next/server';
import { generateCampaignReport } from '@/lib/claude';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const report = await generateCampaignReport();
    if (!report.trim()) {
      return NextResponse.json({ error: 'empty' }, { status: 500 });
    }
    return NextResponse.json({ report });
  } catch (e) {
    console.error('campaign report failed', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
