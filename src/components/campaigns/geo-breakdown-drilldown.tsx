'use client';

import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StatePerformance, StateStatus } from '@/types';

function statusPill(s: StateStatus): { label: string; cls: string } {
  if (s === 'active') return { label: 'Active', cls: 'bg-success/10 text-success' };
  if (s === 'opportunity')
    return { label: 'Opportunity', cls: 'bg-accent/15 text-accent' };
  return { label: 'Low fit', cls: 'bg-muted text-muted-foreground' };
}

function dotFor(scanRate: number): 'green' | 'amber' | 'red' {
  if (scanRate >= 70) return 'green';
  if (scanRate >= 50) return 'amber';
  return 'red';
}

function DotIcon({ tone }: { tone: 'green' | 'amber' | 'red' }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        tone === 'green' && 'bg-success',
        tone === 'amber' && 'bg-accent',
        tone === 'red' && 'bg-destructive',
      )}
      aria-hidden
    />
  );
}

export function GeoBreakdownDrilldown({
  states,
  selectedState,
  onSelectState,
  onClearState,
}: {
  states: StatePerformance[];
  selectedState: string | null;
  onSelectState: (code: string) => void;
  onClearState: () => void;
}) {
  const selected = selectedState
    ? states.find((s) => s.code === selectedState)
    : null;

  // Header
  const header = selected ? (
    <div className="flex items-center justify-between gap-2 border-b border-foreground p-5">
      <div>
        <div className="text-sm font-medium text-foreground">
          {selected.name} breakdown
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {selected.neighborhoods
            ? `${selected.neighborhoods.length} neighborhoods`
            : `${selected.cities?.length ?? 0} cities`}{' '}
          · top city {selected.topCity}
        </p>
      </div>
      <button
        type="button"
        onClick={onClearState}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-foreground hover:border-accent hover:text-accent"
      >
        <ChevronLeft className="h-3 w-3" /> All states
      </button>
    </div>
  ) : (
    <div className="border-b border-foreground p-5">
      <div className="text-sm font-medium text-foreground">
        Geographic breakdown
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Ranked by ICP match — click any state to drill into its cities
      </p>
    </div>
  );

  // Body
  const body = selected ? (
    <ol>
      {selected.neighborhoods
        ? selected.neighborhoods
            .slice()
            .sort((a, b) => b.pairings - a.pairings)
            .map((n, i) => (
              <li
                key={n.neighborhood}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-3 last:border-b-0"
              >
                <span className="text-right text-sm tabular-nums text-muted-foreground">
                  {i + 1}.
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm text-foreground">
                    {n.neighborhood}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {n.pairings.toLocaleString()} deliveries
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {n.scanRate}% scan
                  </span>
                  <DotIcon tone={dotFor(n.scanRate)} />
                </div>
              </li>
            ))
        : (selected.cities ?? []).map((c, i) => (
            <li
              key={c.name}
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-3 last:border-b-0"
            >
              <span className="text-right text-sm tabular-nums text-muted-foreground">
                {i + 1}.
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  {c.estReach.toLocaleString()} est. reach · {c.icpMatch}% ICP
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm tabular-nums text-muted-foreground">
                  {c.predictedScanRate}% scan
                </span>
                <DotIcon tone={dotFor(c.predictedScanRate)} />
              </div>
            </li>
          ))}
    </ol>
  ) : (
    <ol>
      {[...states]
        .sort((a, b) => b.icpMatch - a.icpMatch)
        .map((s, i) => {
          const pill = statusPill(s.status);
          const reach = s.deliveries ?? s.cities?.reduce((a, c) => a + c.estReach, 0) ?? 0;
          return (
            <li key={s.code}>
              <button
                type="button"
                onClick={() => onSelectState(s.code)}
                className="grid w-full grid-cols-[2rem_minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60"
              >
                <span className="text-right text-sm tabular-nums text-muted-foreground">
                  {i + 1}.
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                        pill.cls,
                      )}
                    >
                      {pill.label}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.topCity} ·{' '}
                    {s.deliveries
                      ? `${s.deliveries.toLocaleString()} deliveries`
                      : `${reach.toLocaleString()} est. reach`}
                  </div>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {s.icpMatch}% ICP
                </span>
                <DotIcon tone={dotFor(s.predictedScanRate)} />
              </button>
            </li>
          );
        })}
    </ol>
  );

  return (
    <div className="nibl-card overflow-hidden">
      {header}
      {body}
    </div>
  );
}
