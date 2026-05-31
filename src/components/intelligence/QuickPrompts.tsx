'use client';

export const QUICK_PROMPTS = [
  { label: 'What food pairs best with our drinks?', icon: '🍜' },
  { label: 'Which flavor should we launch next?', icon: '✨' },
  { label: 'Who is our ideal customer?', icon: '👤' },
  { label: 'Which neighborhood should we expand to?', icon: '📍' },
  { label: 'What time of day performs best?', icon: '⏰' },
  { label: 'How do we increase scan rate?', icon: '📈' },
];

export function QuickPrompts({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_PROMPTS.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onPick(p.label)}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent"
        >
          {p.label} <span aria-hidden>{p.icon}</span>
        </button>
      ))}
    </div>
  );
}
