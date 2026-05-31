'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { ChevronDown, ChevronUp, Send, Sparkles } from 'lucide-react';
import { MessageBubble, ThinkingBubble } from './MessageBubble';
import { QuickPrompts } from './QuickPrompts';
import { DataContextCard } from './DataContextCard';
import type { ChatMessage } from '@/lib/intelligence/types';
import { cn } from '@/lib/utils';

const MAX_CHARS = 500;

const STARTERS: { id: string; title: string; user: string; assistant: string }[] = [
  {
    id: 'starter-launch',
    title: 'New flavor launch',
    user: "We're launching cucumber mint sparkling water next month. Would our customers like it?",
    assistant: `Probably **moderate fit, not a hero launch**. Your ICP indexes high on **citrus (81%)** and **carbonation (76%)**, which the sparkling base captures well — but **mint/herbal notes** don't appear in any of your top taste signals, and your top variant (**Yuzu at 312 pairings, 4.8★**) is citrus-forward, not herbal.

- Best-case audience: the **22% health-conscious segment** + the **18% sweet-tooth** crowd looking for a lighter option
- Best food pairing: **Salads** (Yuzu Mint already scores 0.88 there)
- Expect performance in the **62–70% scan rate** range, below your Yuzu hero

→ Recommended action: pilot it as a Salads-only pairing in **East Village** (75% scan rate) before a broader launch.`,
  },
  {
    id: 'starter-expand',
    title: 'Market expansion',
    user: 'Which neighborhood should we double down on for our next campaign?',
    assistant: `Double down on **East Village**. It's already your strongest market — **264 deliveries, 75% scan rate, 4.8★** — and it sits well above your overall **68% scan rate**. Lower East Side (**71%, 4.7★**) is the natural second pick.

Avoid Morningside Heights for now: **78 deliveries, 53% scan rate** — below the NiBL category average of 52%, so spend doesn't compound there yet.

→ Recommended action: shift the next 100 samples to East Village Friday/Saturday dinner slots — your peak window is 7–9 PM and you'll convert at category-leading rates.`,
  },
  {
    id: 'starter-pairing',
    title: 'Food pairing strategy',
    user: 'What food category should we target for our yuzu ginger flavor?',
    assistant: `**Spicy food, no question.** Yuzu Ginger scores **0.89 affinity** with spicy dishes — the highest single cell in your affinity matrix. Your ICP also indexes at **72% spice tolerance**, which is unusually high, so the audience is there.

- Current Yuzu Ginger volume: only **121 pairings** (4th of 5 variants)
- Underexposed: 0.89 affinity vs 0.65 average for the rest of your line
- Closest fit cuisines: Sichuan, Thai, Korean

→ Recommended action: pitch NiBL to pair Yuzu Ginger with spicy Asian orders specifically — the lift should beat your current **65% scan rate** within a week.`,
  },
];

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isoNow(): string {
  return new Date().toISOString();
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showStarters, setShowStarters] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll on new messages / thinking.
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    // Auto-resize textarea (max 3 lines ≈ 96px).
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(96, ta.scrollHeight)}px`;
  }, [input]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_CHARS);
      if (!trimmed || busy) return;
      const userMsg: ChatMessage = {
        id: makeId(),
        role: 'user',
        content: trimmed,
        timestamp: isoNow(),
      };
      setInput('');
      setMessages((prev) => [...prev, userMsg]);
      setBusy(true);
      try {
        const res = await fetch('/api/intelligence/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history: messages }),
        });
        const data = (await res.json()) as { reply: string };
        const reply: ChatMessage = {
          id: makeId(),
          role: 'assistant',
          content: data.reply,
          timestamp: isoNow(),
        };
        setMessages((prev) => [...prev, reply]);
      } catch (e) {
        console.error('chat send failed', e);
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'assistant',
            content:
              "I'm having trouble accessing your data right now. Please try again in a moment.",
            timestamp: isoNow(),
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages],
  );

  const loadStarter = useCallback((starter: (typeof STARTERS)[number]) => {
    const t = isoNow();
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: 'user', content: starter.user, timestamp: t },
      {
        id: makeId(),
        role: 'assistant',
        content: starter.assistant,
        timestamp: t,
      },
    ]);
    setShowStarters(false);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[520px] flex-col overflow-hidden rounded-lg border border-foreground bg-card shadow-flat">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="font-heading text-xl text-foreground">Brand Intelligence</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask anything about your consumers — powered by{' '}
              <span className="font-medium text-foreground">847 real NiBL data points</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
            <Sparkles className="h-3 w-3" /> Claude AI · Kace Beverages data
          </span>
        </div>
      </div>

      {/* Scrollable conversation */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-muted/40 px-4 py-5 sm:px-6"
      >
        {empty ? (
          <div className="space-y-4">
            <StarterAccordion
              open={showStarters}
              onToggle={() => setShowStarters((s) => !s)}
              onPick={loadStarter}
            />
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                Quick prompts
              </div>
              <QuickPrompts onPick={(p) => send(p)} />
            </div>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
        {busy ? <ThinkingBubble /> : null}
      </div>

      {/* Sticky composer */}
      <form
        onSubmit={onSubmit}
        className="space-y-2 border-t border-border bg-card px-4 py-3 sm:px-6"
      >
        <DataContextCard />
        <div className="flex items-end gap-2">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={onKey}
            rows={1}
            placeholder="Ask about your consumers, new products, pairings…"
            className="flex-1 resize-none rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:border-foreground focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            aria-label="Send"
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground text-accent-foreground shadow-flat transition-all',
              !input.trim() || busy
                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                : 'bg-accent hover:-translate-y-px hover:shadow-flat-lg',
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Responses based on 847 NiBL customer data points</span>
          <span className="tabular-nums">
            {input.length} / {MAX_CHARS}
          </span>
        </div>
      </form>
    </div>
  );
}

function StarterAccordion({
  open,
  onToggle,
  onPick,
}: {
  open: boolean;
  onToggle: () => void;
  onPick: (s: (typeof STARTERS)[number]) => void;
}) {
  return (
    <div className="nibl-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2.5 text-[12px] text-foreground hover:bg-muted"
      >
        <span>✦ Example conversations</span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open ? (
        <ul className="divide-y divide-border border-t border-border">
          {STARTERS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(s)}
                className="block w-full px-4 py-3 text-left hover:bg-muted"
              >
                <div className="text-[12px] font-medium text-foreground">{s.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {s.user}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
