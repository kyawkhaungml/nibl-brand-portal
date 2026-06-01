import { Brain, Home, Target, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Feature = {
  icon: LucideIcon;
  label: string;
  body: string;
  delayMs: number;
};

const FEATURES: Feature[] = [
  {
    icon: Home,
    label: 'Overview',
    body: 'Daily reach, conversion, and smart alerts at a glance.',
    delayMs: 700,
  },
  {
    icon: Target,
    label: 'My Campaign',
    body: 'Track running campaigns and launch new ones.',
    delayMs: 900,
  },
  {
    icon: Users,
    label: 'Audience',
    body: 'The taste profile of customers trying your product.',
    delayMs: 1100,
  },
  {
    icon: Brain,
    label: 'Intelligence',
    body: 'Chat with your data and predict new launches.',
    delayMs: 1300,
  },
];

export function StepToolkit() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[200ms] font-heading text-display-xl text-foreground sm:text-display-2xl">
          Your toolkit
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[500ms] text-sm text-muted-foreground">
          Four surfaces, one decision loop.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="animate-in fade-in zoom-in-95 fill-mode-both rounded-xl border border-border bg-card p-4 duration-500"
              style={{ animationDelay: `${f.delayMs}ms` }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/15">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div className="mt-3 text-sm font-medium text-foreground">
                {f.label}
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          );
        })}
      </div>

      <p className="animate-in fade-in fill-mode-both pt-2 text-center text-[12px] text-muted-foreground duration-500 delay-[1500ms]">
        Click <span className="font-medium text-foreground">Get started</span>{' '}
        to land in the portal.
      </p>
    </div>
  );
}
