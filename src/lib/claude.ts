import 'server-only';

import Anthropic from '@anthropic-ai/sdk';
import { serverEnv } from './env';
import { CHAT_SYSTEM_PROMPT, PREDICT_SYSTEM_PROMPT } from './intelligence/prompts';
import type {
  ChatMessage,
  ChatReplyStructured,
  ProductPrediction,
} from './intelligence/types';

const MODEL = 'claude-sonnet-4-6';

let cached: Anthropic | null = null;
function getClient(): Anthropic {
  if (!serverEnv.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set on the server.');
  }
  if (cached) return cached;
  cached = new Anthropic({ apiKey: serverEnv.anthropicApiKey });
  return cached;
}

function extractText(message: Anthropic.Messages.Message): string {
  return message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

export async function generateTasteInsight(payload: unknown): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 200,
    system:
      'You are a CPG brand analytics assistant. Given taste profile data, write a 2-3 sentence insight summary for a beverage brand partner. Be specific and actionable.',
    messages: [
      {
        role: 'user',
        content: `Here is the taste-analytics data for our brand:\n\n${JSON.stringify(
          payload,
          null,
          2,
        )}\n\nWrite a 2-3 sentence insight.`,
      },
    ],
  });
  return extractText(msg);
}

export async function generateCampaignInsight(payload: unknown): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 220,
    system:
      'You are a CPG brand analytics assistant. Given a beverage brand’s NiBL sampling-campaign data, write ONE actionable 2-3 sentence insight for the brand partner. Be specific about pairings, neighborhoods, or time slots they should lean into next. No greetings, no preamble — just the insight.',
    messages: [
      {
        role: 'user',
        content: `Campaign data:\n\n${JSON.stringify(payload, null, 2)}`,
      },
    ],
  });
  return extractText(msg);
}

const CAMPAIGN_REPORT_SYSTEM_PROMPT = `You are a CPG campaign performance advisor for NiBL Brand Intelligence. Write a strategic campaign report. Structure as exactly 3 paragraphs with no headers or bullet points — flowing prose only.

Paragraph 1: Performance summary. What went well. Cite specific numbers.

Paragraph 2: Areas for improvement. Be specific about gaps vs benchmark. Do not sugarcoat.

Paragraph 3: Three specific actionable recommendations for the next 30 days. Number them inline (1. 2. 3.) within the paragraph.

Campaign data to analyze:
- 847 samples distributed (85% of 1000 budget used)
- 68% QR scan rate (category avg: 52%) — above
- 4.7/5 avg rating (category avg: 4.5) — above
- 34% buy-again (category avg: 38%) — BELOW benchmark
- Top flavor: Yuzu (74% scan rate, 4.8 stars)
- Weakest: Cold Brew Tonic (58% scan, 4.3 stars)
- Best area: East Village (75% scan rate)
- Worst area: Morningside Heights (53% scan rate)
- Peak time: Dinner 7-9 PM (40% of all pairings)
- 153 samples remaining, campaign ongoing

Be confident and direct. Max 180 words total.`;

export async function generateCampaignReport(): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 350,
    system: CAMPAIGN_REPORT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: 'Generate the report now.' }],
  });
  return extractText(msg);
}

export type ChatGenerationResult = {
  text: string;                          // plain-text linearization (also used for clipboard / fallback)
  structured?: ChatReplyStructured;      // present when Claude's JSON parsed OK
};

function structuredToText(r: ChatReplyStructured): string {
  const parts: string[] = [r.intro];
  if (r.comparisons?.length) {
    parts.push(
      r.comparisons
        .map((c) => `${c.leftLabel} ${c.leftPct}% vs ${c.rightLabel} ${c.rightPct}%`)
        .join('\n'),
    );
  }
  if (r.states?.length) {
    parts.push(
      `${r.statesCaption ?? 'Top fit states'}: ` +
        r.states.map((s) => `${s.code} ${s.score}%`).join(' · '),
    );
  }
  if (r.whatsWorking?.length) {
    parts.push(
      "What's working:\n" + r.whatsWorking.map((b) => `• ${b}`).join('\n'),
    );
  }
  if (r.watchOuts?.length) {
    parts.push(
      'Watch-outs:\n' + r.watchOuts.map((b) => `• ${b}`).join('\n'),
    );
  }
  parts.push(`→ Recommended action: ${r.recommendation}`);
  return parts.join('\n\n');
}

function tryParseStructured(raw: string): ChatReplyStructured | undefined {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0) return undefined;
  try {
    const obj = JSON.parse(raw.slice(start, end + 1)) as Partial<ChatReplyStructured>;
    if (typeof obj.intro !== 'string' || typeof obj.recommendation !== 'string') {
      return undefined;
    }
    return obj as ChatReplyStructured;
  } catch {
    return undefined;
  }
}

export async function generateIntelligenceChat(
  userMessage: string,
  history: ChatMessage[],
): Promise<ChatGenerationResult> {
  const client = getClient();
  const trimmed = history.slice(-6).map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 700,
    system: CHAT_SYSTEM_PROMPT,
    messages: [...trimmed, { role: 'user', content: userMessage }],
  });
  const raw = extractText(msg);
  const structured = tryParseStructured(raw);
  if (structured) {
    return { text: structuredToText(structured), structured };
  }
  return { text: raw };
}

export async function generateProductPrediction(
  flavorDescription: string,
  targetFoods: string[],
): Promise<ProductPrediction> {
  const client = getClient();
  const userContent = `New flavor description:\n${flavorDescription}\n\nTarget food pairings the brand is considering:\n${targetFoods.length ? targetFoods.join(', ') : '(none specified — recommend the best one)'}\n\nReturn the JSON now.`;
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: PREDICT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
  });
  const raw = extractText(msg);
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0) {
    throw new Error('Predictor returned no JSON.');
  }
  const parsed = JSON.parse(raw.slice(start, end + 1)) as ProductPrediction;
  // Clamp to ranges in case the model returned out-of-bounds values.
  return {
    predictedScanRate: clamp(parsed.predictedScanRate, 0, 100),
    predictedRating: clamp(parsed.predictedRating, 0, 5),
    predictedBuyAgain: clamp(parsed.predictedBuyAgain, 0, 100),
    icpFitScore: clamp(parsed.icpFitScore, 0, 100),
    analysis: String(parsed.analysis ?? '').trim(),
    bestFoodPairing: String(parsed.bestFoodPairing ?? '').trim(),
    bestFoodAffinityScore: clamp(parsed.bestFoodAffinityScore, 0, 1),
    riskFlag: parsed.riskFlag ? String(parsed.riskFlag).trim() : null,
  };
}

function clamp(n: unknown, lo: number, hi: number): number {
  const x = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

export type CampaignSuggestion = { title: string; body: string };

export async function generateCampaignSuggestions(
  payload: unknown,
): Promise<CampaignSuggestion[]> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system:
      'You are a CPG brand analytics assistant. Given a beverage brand’s NiBL sampling-campaign data, return exactly 3 specific, actionable optimization suggestions. Respond with ONLY a JSON object of the form {"suggestions":[{"title":"…","body":"…"}, …]} — no prose, no code fences. Each title should be one of: "Best food pairing to target", "Best time slot to focus on", "Neighborhood to prioritize". Each body should be concise (≤ 2 sentences) and grounded in the data.',
    messages: [
      {
        role: 'user',
        content: `Campaign data:\n\n${JSON.stringify(payload, null, 2)}`,
      },
    ],
  });
  const raw = extractText(msg);
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end < 0) throw new Error('no JSON found');
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      suggestions?: CampaignSuggestion[];
    };
    return parsed.suggestions ?? [];
  } catch {
    // Fallback: split the text into 3 chunks so the UI still has something.
    const lines = raw.split('\n').filter(Boolean).slice(0, 3);
    return lines.map((l, i) => ({
      title:
        ['Best food pairing to target', 'Best time slot to focus on', 'Neighborhood to prioritize'][i] ??
        'Suggestion',
      body: l,
    }));
  }
}
