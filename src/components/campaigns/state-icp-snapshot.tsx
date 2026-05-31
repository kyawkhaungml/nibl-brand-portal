'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import type { StatePerformance } from '@/types';

export function StateIcpSnapshot({
  states,
  selectedState,
}: {
  states: StatePerformance[];
  selectedState: string | null;
}) {
  const ny = states.find((s) => s.code === 'NY');
  const selected = selectedState
    ? states.find((s) => s.code === selectedState)
    : null;

  // Default: show NY (active market) snapshot.
  const state = selected ?? ny;
  if (!state) return null;
  const snap = state.icpSnapshot;
  const isHome = state.status === 'active';

  return (
    <div className="nibl-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-sm font-medium text-foreground">
            {selected
              ? `${state.name} — predicted ICP`
              : 'Your active market'}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {selected
              ? `${state.icpMatch}% match to your top buyers · top city ${state.topCity}`
              : `Anchor: ${state.name} (${state.topCity})`}
          </p>
        </div>
        <span
          className={[
            'rounded-full px-2 py-0.5 text-[11px] font-medium',
            isHome ? 'bg-success/10 text-success' : 'bg-accent/15 text-accent',
          ].join(' ')}
        >
          {isHome ? 'Active market' : 'Opportunity'}
        </span>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {/* Taste fit */}
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Taste fit
          </div>
          <div className="space-y-2.5">
            <TasteRow label="Citrus" value={snap.citrusPreference} />
            <TasteRow label="Carbonation" value={snap.carbonationPreference} />
            <TasteRow label="Spice" value={snap.spiceTolerance} />
          </div>
        </div>

        {/* Demographics */}
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Demographics
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Peak time</span>
              <span className="text-foreground">{snap.peakTime}</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Avg order</span>
              <span className="tabular-nums text-foreground">
                ${snap.avgOrderValue.toFixed(2)}
              </span>
            </li>
            <li>
              <div className="text-muted-foreground">Top cuisines</div>
              <div className="mt-0.5 text-foreground">
                {snap.topCuisines.join(' · ')}
              </div>
            </li>
          </ul>
        </div>

        {/* Why this state */}
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            {selected ? 'Why this state' : 'Anchor insight'}
          </div>
          <div className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[13px] leading-relaxed text-foreground">
            {snap.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}

function TasteRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between text-xs">
        <span className="text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <ProgressBar value={value} tone="accent" />
    </div>
  );
}
