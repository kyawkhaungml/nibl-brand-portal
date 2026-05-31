'use client';

import { useState, type FormEvent } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { FOOD_CATEGORIES } from '@/lib/intelligence/brandData';
import type { FoodCategory, ProductPrediction } from '@/lib/intelligence/types';
import { cn } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'ready'; flavor: string; prediction: ProductPrediction };

function MetricBar({
  label,
  value,
  display,
  pct,
}: {
  label: string;
  value: string;
  display: string;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span className="text-foreground">{label}</span>
        <span className="font-medium tabular-nums text-foreground">
          {display}
        </span>
      </div>
      <div className="nibl-progress">
        <div
          className="nibl-progress-fill"
          style={{ width: `${pct}%`, transition: 'width 600ms ease-out' }}
          aria-label={`${label}: ${value}`}
        />
      </div>
    </div>
  );
}

export function ProductPredictor() {
  const [flavor, setFlavor] = useState('');
  const [foods, setFoods] = useState<FoodCategory[]>([]);
  const [state, setState] = useState<State>({ kind: 'idle' });

  function toggleFood(c: FoodCategory) {
    setFoods((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const f = flavor.trim();
    if (!f) return;
    setState({ kind: 'loading' });
    try {
      const res = await fetch('/api/intelligence/predict', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ flavorDescription: f, targetFoods: foods }),
      });
      if (!res.ok) throw new Error('predict failed');
      const data = (await res.json()) as { prediction: ProductPrediction };
      setState({ kind: 'ready', flavor: f, prediction: data.prediction });
    } catch (e) {
      console.error('predictor failed', e);
      setState({ kind: 'error' });
    }
  }

  return (
    <div className="nibl-card p-5">
      <div>
        <div className="text-sm font-medium text-foreground">
          New product predictor
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Predict how a new flavor would perform with your current customers
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="flavor-desc"
            className="block text-[12px] text-muted-foreground"
          >
            Describe your new flavor
          </label>
          <textarea
            id="flavor-desc"
            rows={2}
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            placeholder="e.g. Cucumber mint sparkling water — light, herbal, low sweetness, high carbonation"
            className="mt-1 w-full resize-none rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:border-foreground focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15"
          />
        </div>

        <div>
          <label className="block text-[12px] text-muted-foreground">
            Target food pairings (optional)
          </label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {FOOD_CATEGORIES.map((c) => {
              const active = foods.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleFood(c)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-[12px] transition-colors',
                    active
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border bg-card text-foreground hover:border-accent',
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!flavor.trim() || state.kind === 'loading'}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg border border-foreground px-4 py-2 text-sm font-medium shadow-flat transition-all',
            state.kind === 'loading' || !flavor.trim()
              ? 'cursor-not-allowed bg-muted text-muted-foreground'
              : 'bg-accent text-accent-foreground hover:-translate-y-px hover:shadow-flat-lg',
          )}
        >
          {state.kind === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing against 847 customer profiles…
            </>
          ) : (
            <>Predict performance →</>
          )}
        </button>
      </form>

      {state.kind === 'error' ? (
        <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[12px] text-foreground">
          <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-accent" />
          We couldn&apos;t predict that one. Try again with a slightly different
          flavor description.
        </div>
      ) : null}

      {state.kind === 'ready' ? (
        <div className="mt-5 space-y-4 border-t border-border pt-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Performance prediction
            </div>
            <div className="mt-0.5 text-sm italic text-foreground">
              “{state.flavor}”
            </div>
          </div>

          <div className="space-y-3">
            <MetricBar
              label="Predicted scan rate"
              value={`${state.prediction.predictedScanRate}%`}
              display={`${state.prediction.predictedScanRate}%`}
              pct={state.prediction.predictedScanRate}
            />
            <MetricBar
              label="Predicted avg rating"
              value={`${state.prediction.predictedRating.toFixed(1)} / 5`}
              display={state.prediction.predictedRating.toFixed(1)}
              pct={(state.prediction.predictedRating / 5) * 100}
            />
            <MetricBar
              label="Predicted buy again"
              value={`${state.prediction.predictedBuyAgain}%`}
              display={`${state.prediction.predictedBuyAgain}%`}
              pct={state.prediction.predictedBuyAgain}
            />
            <MetricBar
              label="ICP fit score"
              value={`${state.prediction.icpFitScore}%`}
              display={`${state.prediction.icpFitScore}%`}
              pct={state.prediction.icpFitScore}
            />
          </div>

          <p className="text-[13px] leading-relaxed text-foreground">
            {state.prediction.analysis}
          </p>

          <div className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[12px] text-foreground">
            Best food to pair with:{' '}
            <span className="font-semibold text-accent">
              {state.prediction.bestFoodPairing}
            </span>{' '}
            <span className="text-muted-foreground">
              ({state.prediction.bestFoodAffinityScore.toFixed(2)} affinity)
            </span>
          </div>

          {state.prediction.riskFlag ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-[12px] text-foreground">
              <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-destructive" />
              <span className="font-medium">Risk:</span>{' '}
              {state.prediction.riskFlag}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
