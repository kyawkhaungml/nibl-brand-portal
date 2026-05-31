import { NextResponse } from 'next/server';
import { generateProductPrediction } from '@/lib/claude';
import type { PredictRequest } from '@/lib/intelligence/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: PredictRequest;
  try {
    body = (await req.json()) as PredictRequest;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const flavor = typeof body.flavorDescription === 'string'
    ? body.flavorDescription.trim()
    : '';
  if (!flavor) {
    return NextResponse.json({ error: 'missing flavor description' }, { status: 400 });
  }
  const foods = Array.isArray(body.targetFoods) ? body.targetFoods : [];
  try {
    const prediction = await generateProductPrediction(flavor, foods);
    return NextResponse.json({ prediction });
  } catch (e) {
    console.error('intelligence predict failed', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
