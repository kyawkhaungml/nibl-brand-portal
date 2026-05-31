'use client';

import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import {
  BRAND_DATA_CONTEXT,
  FLAVORS,
  FOOD_CATEGORIES,
} from '@/lib/intelligence/brandData';
import type { FlavorName, FoodCategory } from '@/lib/intelligence/types';

function cellTint(score: number): string {
  if (score > 0.85) return 'bg-accent text-accent-foreground';
  if (score > 0.7) return 'bg-accent/15 text-foreground';
  if (score > 0.55) return 'bg-muted text-foreground';
  return 'bg-background text-muted-foreground';
}

function flavorMeta(flavor: FlavorName) {
  return BRAND_DATA_CONTEXT.flavorPerformance.find(
    (v) => v.flavor === flavor,
  );
}

const ABBREV: Record<FoodCategory, string> = {
  Japanese: 'Jap',
  Salads: 'Sal',
  Asian: 'Asian',
  American: 'Am',
  Spicy: 'Spicy',
  Mexican: 'Mex',
};

export function AffinityMatrix() {
  const matrix = BRAND_DATA_CONTEXT.flavorFoodAffinityMatrix;

  const best = useMemo(() => {
    let bestFlavor: FlavorName = FLAVORS[0];
    let bestFood: FoodCategory = FOOD_CATEGORIES[0];
    let bestScore = -Infinity;
    for (const f of FLAVORS) {
      for (const c of FOOD_CATEGORIES) {
        const v = matrix[f][c];
        if (v > bestScore) {
          bestScore = v;
          bestFlavor = f;
          bestFood = c;
        }
      }
    }
    return { flavor: bestFlavor, food: bestFood, score: bestScore };
  }, [matrix]);

  const [hover, setHover] = useState<{ flavor: FlavorName; food: FoodCategory } | null>(
    null,
  );

  return (
    <div className="nibl-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-foreground">
            Flavor affinity matrix
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Which flavors work best with which foods
          </p>
        </div>
        <span
          className="cursor-help text-[10px] uppercase tracking-wide text-muted-foreground"
          title={`Affinity score = (scan_rate × 0.4) + (avg_rating × 0.3) + (repeat_rate × 0.3). Calculated from real NiBL delivery data.`}
        >
          ML · weighted scoring
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-[11px]">
          <thead>
            <tr>
              <th className="w-[110px]" />
              {FOOD_CATEGORIES.map((c) => (
                <th
                  key={c}
                  className="text-center font-medium text-muted-foreground"
                >
                  {ABBREV[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FLAVORS.map((flavor) => {
              const meta = flavorMeta(flavor);
              return (
                <tr key={flavor}>
                  <th className="pr-2 text-left text-[12px] font-medium text-foreground">
                    {flavor}
                  </th>
                  {FOOD_CATEGORIES.map((food) => {
                    const score = matrix[flavor][food];
                    const isBest =
                      best.flavor === flavor && best.food === food;
                    const isHover =
                      hover?.flavor === flavor && hover?.food === food;
                    return (
                      <td key={food} className="relative">
                        <div
                          onMouseEnter={() => setHover({ flavor, food })}
                          onMouseLeave={() => setHover(null)}
                          className={[
                            'flex h-11 w-full items-center justify-center rounded-md border border-border tabular-nums',
                            cellTint(score),
                          ].join(' ')}
                        >
                          {score.toFixed(2)}
                          {isBest ? (
                            <Star className="ml-0.5 h-3 w-3 fill-current" />
                          ) : null}
                        </div>
                        {isHover ? (
                          <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-56 -translate-x-1/2 rounded-md border border-foreground bg-card px-3 py-2 text-[11px] text-foreground shadow-flat">
                            <div className="font-medium">
                              {flavor} × {food}
                            </div>
                            <div className="mt-0.5 text-muted-foreground">
                              {score >= 0.85
                                ? 'Strong match'
                                : score >= 0.7
                                  ? 'Good match'
                                  : score >= 0.55
                                    ? 'Average'
                                    : 'Weak match'}{' '}
                              {meta
                                ? `· ${meta.scanRate}% scan · ${meta.avgRating.toFixed(1)}★`
                                : null}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[12px] text-accent">
        <Star className="h-3.5 w-3.5 fill-current" />
        Best overall pairing: <span className="font-medium">{best.flavor}</span> ×{' '}
        <span className="font-medium">{best.food}</span>{' '}
        <span className="text-muted-foreground">({best.score.toFixed(2)})</span>
      </div>
    </div>
  );
}
