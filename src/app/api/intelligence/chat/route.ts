import { NextResponse } from 'next/server';
import { generateIntelligenceChat } from '@/lib/claude';
import type { ChatRequest } from '@/lib/intelligence/types';

export const runtime = 'nodejs';

const FALLBACK =
  "I'm having trouble accessing your data right now. Please try again in a moment.";

export async function POST(req: Request) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ reply: FALLBACK }, { status: 200 });
  }
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return NextResponse.json({ reply: FALLBACK }, { status: 200 });
  }
  const history = Array.isArray(body.history) ? body.history : [];
  try {
    const reply = await generateIntelligenceChat(message, history);
    return NextResponse.json({ reply: reply || FALLBACK });
  } catch (e) {
    console.error('intelligence chat failed', e);
    return NextResponse.json({ reply: FALLBACK }, { status: 200 });
  }
}
