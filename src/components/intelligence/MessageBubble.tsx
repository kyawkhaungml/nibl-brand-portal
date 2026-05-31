'use client';

import { Sparkles } from 'lucide-react';
import { ComparisonBars } from './ComparisonBars';
import { MiniStateMap } from './MiniStateMap';
import { InsightCallout } from './InsightCallout';
import type {
  ChatMessage,
  ChatReplyStructured,
  StateScore,
} from '@/lib/intelligence/types';

// Demo placeholder shown when a structured reply doesn't include `states`.
// Matches the top fit states in kaceMockData.geoBreakdown so the map reads
// consistent with the rest of the portal.
const DEFAULT_PLACEHOLDER_STATES: StateScore[] = [
  { code: 'NY', name: 'New York',      score: 100 },
  { code: 'CA', name: 'California',    score:  89 },
  { code: 'MA', name: 'Massachusetts', score:  85 },
  { code: 'WA', name: 'Washington',    score:  82 },
  { code: 'IL', name: 'Illinois',      score:  80 },
  { code: 'CO', name: 'Colorado',      score:  79 },
  { code: 'OR', name: 'Oregon',        score:  76 },
];

function fmtTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Plain-text markdown fallback: **bold**, bullets, and "→ Recommended action:" line.
function renderAssistantText(content: string): React.ReactNode {
  const lines = content.split('\n');
  const ACTION_RE = /^→\s*Recommended action:\s*(.+)$/i;
  const out: React.ReactNode[] = [];
  let bulletBuf: string[] = [];

  function flushBullets(key: number) {
    if (bulletBuf.length) {
      out.push(
        <ul key={`ul-${key}`} className="my-1 ml-4 list-disc space-y-0.5">
          {bulletBuf.map((b, i) => (
            <li key={i}>{renderInline(b)}</li>
          ))}
        </ul>,
      );
      bulletBuf = [];
    }
  }

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const action = ACTION_RE.exec(line);
    if (action) {
      flushBullets(idx);
      out.push(<ActionLine key={`act-${idx}`} text={action[1]} />);
      return;
    }
    const bullet = line.match(/^[-•]\s+(.*)$/);
    if (bullet) {
      bulletBuf.push(bullet[1]);
      return;
    }
    flushBullets(idx);
    if (!line) {
      out.push(<div key={`br-${idx}`} className="h-2" />);
      return;
    }
    out.push(
      <p key={`p-${idx}`} className="my-1">
        {renderInline(line)}
      </p>,
    );
  });
  flushBullets(lines.length);
  return out;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    parts.push(
      <span key={`b-${i++}`} className="font-semibold text-accent">
        {m[1]}
      </span>,
    );
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

function ActionLine({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[12px] text-foreground">
      <span className="text-accent">→ Recommended action:</span> {text}
    </div>
  );
}

function renderStructured(r: ChatReplyStructured): React.ReactNode {
  return (
    <div className="space-y-3">
      <p className="text-[13px] leading-relaxed">{r.intro}</p>

      {r.comparisons && r.comparisons.length > 0 ? (
        <div className="space-y-2">
          <SectionLabel>Comparison</SectionLabel>
          <ComparisonBars items={r.comparisons} />
        </div>
      ) : null}

      {(() => {
        const hasStates = !!(r.states && r.states.length > 0);
        const statesToShow = hasStates ? r.states! : DEFAULT_PLACEHOLDER_STATES;
        const caption = hasStates
          ? (r.statesCaption ?? 'Where your ICP shows up')
          : 'Where your ICP shows up (placeholder)';
        return (
          <div className="space-y-2">
            <SectionLabel>{caption}</SectionLabel>
            <MiniStateMap states={statesToShow} caption={caption} />
          </div>
        );
      })()}

      {r.whatsWorking && r.whatsWorking.length > 0 ? (
        <InsightCallout
          tone="positive"
          label="What's working"
          items={r.whatsWorking}
        />
      ) : null}

      {r.watchOuts && r.watchOuts.length > 0 ? (
        <InsightCallout
          tone="caution"
          label="Watch-outs"
          items={r.watchOuts}
        />
      ) : null}

      <ActionLine text={r.recommendation} />
    </div>
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const hasRich =
    !!message.structured &&
    typeof message.structured.intro === 'string' &&
    typeof message.structured.recommendation === 'string';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={isUser ? 'max-w-[80%]' : 'max-w-[88%]'}>
        {!isUser ? (
          <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" /> NiBL Intelligence
          </div>
        ) : null}
        <div
          className={[
            'px-4 py-2.5 text-[13px] leading-relaxed',
            isUser
              ? 'bg-accent text-accent-foreground rounded-[16px_16px_4px_16px]'
              : 'bg-card text-foreground border border-foreground shadow-flat-sm rounded-[16px_16px_16px_4px]',
          ].join(' ')}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : hasRich ? (
            renderStructured(message.structured!)
          ) : (
            renderAssistantText(message.content)
          )}
        </div>
        <div
          className={`mt-1 text-[10px] text-muted-foreground ${isUser ? 'text-right' : 'text-left'}`}
        >
          {fmtTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

export function ThinkingBubble() {
  return (
    <div className="flex w-full justify-start">
      <div>
        <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" /> NiBL Intelligence
        </div>
        <div className="flex items-center gap-2 rounded-[16px_16px_16px_4px] border border-foreground bg-card px-4 py-2.5 text-[13px] text-muted-foreground shadow-flat-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Analyzing your consumer data
          <span className="ml-1 inline-flex gap-0.5">
            <Dot delay={0} />
            <Dot delay={120} />
            <Dot delay={240} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}
