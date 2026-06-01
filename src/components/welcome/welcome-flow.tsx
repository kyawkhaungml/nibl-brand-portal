'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StepWelcome } from './step-welcome';
import { StepHowItWorks } from './step-how-it-works';
import { StepToolkit } from './step-toolkit';

const TOTAL_STEPS = 3;

export function WelcomeFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const onNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      try {
        window.localStorage.setItem('nibl:welcome-seen', '1');
      } catch {
        /* ignore */
      }
      router.push('/dashboard');
    }
  }, [step, router]);

  const onBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const onSkip = useCallback(() => {
    try {
      window.localStorage.setItem('nibl:welcome-seen', '1');
    } catch {
      /* ignore */
    }
    router.push('/dashboard');
  }, [router]);

  // Keyboard navigation.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onBack();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext, onBack]);

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <div className="relative flex min-h-screen flex-col bg-muted/40">
      {/* Soft accent radial flourish */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 animate-in fade-in duration-1000"
        style={{
          background:
            'radial-gradient(60% 50% at 80% 10%, rgba(255,92,37,0.10) 0%, transparent 70%), radial-gradient(50% 40% at 10% 90%, rgba(255,92,37,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Skip intro */}
      <div className="relative z-10 flex items-center justify-end px-6 py-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip intro →
        </button>
      </div>

      {/* Step content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-24 sm:px-6">
        <div
          key={step}
          className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500"
        >
          <div className="nibl-card p-8 sm:p-12 md:p-14">
            {step === 0 ? <StepWelcome /> : null}
            {step === 1 ? <StepHowItWorks /> : null}
            {step === 2 ? <StepToolkit /> : null}
          </div>
        </div>
      </main>

      {/* Footer nav */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="w-20">
            {step > 0 ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === step
                    ? 'w-6 bg-accent'
                    : i < step
                      ? 'w-1.5 bg-accent/40'
                      : 'w-1.5 bg-border',
                )}
                aria-hidden
              />
            ))}
          </div>

          <div className="w-32 text-right">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1 rounded-lg border border-foreground bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground shadow-flat transition-all hover:-translate-y-px hover:shadow-flat-lg"
            >
              {isLast ? 'Get started' : 'Next'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
