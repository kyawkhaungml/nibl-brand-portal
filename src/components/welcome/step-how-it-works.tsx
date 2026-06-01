import { BarChart3, Package, Sparkles, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Step = {
  num: number;
  icon: LucideIcon;
  title: string;
  body: string;
  delayMs: number;
};

const STEPS: Step[] = [
  {
    num: 1,
    icon: Package,
    title: 'Your brand ships samples',
    body: 'You send a batch of your drink to NiBL.',
    delayMs: 700,
  },
  {
    num: 2,
    icon: Sparkles,
    title: 'NiBL’s AI pairs each sample',
    body: 'Our model matches your variants to the right customer’s taste profile and food order.',
    delayMs: 1000,
  },
  {
    num: 3,
    icon: Truck,
    title: 'Drivers deliver with the meal',
    body: 'The sample arrives alongside the customer’s NiBL order — nothing extra to think about.',
    delayMs: 1300,
  },
  {
    num: 4,
    icon: BarChart3,
    title: 'Every action streams back here',
    body: 'Scans, ratings, repeat orders — you see the data live in this portal.',
    delayMs: 1600,
  },
];

export function StepHowItWorks() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[200ms] font-heading text-display-xl text-foreground sm:text-display-2xl">
          How your brand connects with NiBL
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[500ms] text-sm text-muted-foreground">
          Every sample that goes out becomes data here.
        </p>
      </div>

      <ol className="mt-2 space-y-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <li
              key={s.num}
              className="animate-in fade-in slide-in-from-left-4 fill-mode-both flex items-start gap-3 rounded-xl border border-border bg-card p-4 duration-500"
              style={{ animationDelay: `${s.delayMs}ms` }}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[12px] font-semibold text-accent">
                {s.num}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  {s.title}
                </div>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
