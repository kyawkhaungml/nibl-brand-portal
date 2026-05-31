'use client';

import { useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import type { StatePerformance, StateStatus } from '@/types';
import { FIPS_TO_STATE } from '@/lib/us-states';

function fillFor(state: StatePerformance | undefined): string {
  if (!state) return '#F0F0EE';
  if (state.status === 'active') return '#FF5C25';
  const m = state.icpMatch;
  if (m >= 85) return 'rgba(255, 92, 37, 0.7)';
  if (m >= 70) return 'rgba(255, 92, 37, 0.45)';
  if (m >= 55) return 'rgba(255, 92, 37, 0.22)';
  if (m >= 40) return 'rgba(255, 92, 37, 0.1)';
  return '#F0F0EE';
}

function statusLabel(s: StateStatus): string {
  if (s === 'active') return 'Active';
  if (s === 'opportunity') return 'Opportunity';
  return 'Low fit';
}

export function USPerformanceMap({
  states,
  selectedState,
  onSelectState,
}: {
  states: StatePerformance[];
  selectedState: string | null;
  onSelectState: (code: string | null) => void;
}) {
  const byCode = useMemo(() => {
    const m = new Map<string, StatePerformance>();
    states.forEach((s) => m.set(s.code, s));
    return m;
  }, [states]);

  const [hover, setHover] = useState<{
    state: StatePerformance;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="nibl-card relative p-5">
      <div className="mb-3">
        <div className="text-sm font-medium text-foreground">
          US expansion map
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Colored by ICP match. Hover to inspect, click to drill in.
        </p>
      </div>

      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={980}
          height={560}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography="/maps/us-states-10m.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = FIPS_TO_STATE[String(geo.id).padStart(2, '0')];
                const data = code ? byCode.get(code) : undefined;
                const isSelected =
                  selectedState != null && data?.code === selectedState;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillFor(data)}
                    stroke={isSelected ? '#000' : '#FFFFFF'}
                    strokeWidth={isSelected ? 1.5 : 0.6}
                    onMouseEnter={(e) => {
                      if (!data) return;
                      const rect = (
                        e.currentTarget.ownerSVGElement as SVGSVGElement | null
                      )
                        ?.closest('.nibl-card')
                        ?.getBoundingClientRect();
                      setHover({
                        state: data,
                        x: e.clientX - (rect?.left ?? 0) + 12,
                        y: e.clientY - (rect?.top ?? 0) + 12,
                      });
                    }}
                    onMouseMove={(e) => {
                      if (!data) return;
                      const rect = (
                        e.currentTarget.ownerSVGElement as SVGSVGElement | null
                      )
                        ?.closest('.nibl-card')
                        ?.getBoundingClientRect();
                      setHover({
                        state: data,
                        x: e.clientX - (rect?.left ?? 0) + 12,
                        y: e.clientY - (rect?.top ?? 0) + 12,
                      });
                    }}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => {
                      if (!data) return;
                      onSelectState(
                        selectedState === data.code ? null : data.code,
                      );
                    }}
                    style={{
                      default: { outline: 'none', cursor: data ? 'pointer' : 'default' },
                      hover: {
                        outline: 'none',
                        fill: data ? '#FF5C25' : '#F0F0EE',
                        opacity: data ? 0.9 : 1,
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-2 right-2 rounded-md border border-border bg-card/95 px-3 py-2 text-[10px] text-muted-foreground shadow-flat-sm">
          <div className="mb-1 uppercase tracking-wide">ICP match</div>
          <div className="flex items-center gap-3">
            <Swatch fill="#FF5C25" label="Active" />
            <Swatch fill="rgba(255,92,37,0.7)" label="≥85" />
            <Swatch fill="rgba(255,92,37,0.45)" label="70-84" />
            <Swatch fill="rgba(255,92,37,0.22)" label="55-69" />
            <Swatch fill="#F0F0EE" label="<55" />
          </div>
        </div>

        {/* Hover tooltip */}
        {hover ? (
          <div
            className="pointer-events-none absolute z-10 max-w-[240px] rounded-md border border-foreground bg-card px-3 py-2 text-[12px] shadow-flat"
            style={{ left: hover.x, top: hover.y }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground">
                {hover.state.name}
              </span>
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                  hover.state.status === 'active' &&
                    'bg-success/10 text-success',
                  hover.state.status === 'opportunity' &&
                    'bg-accent/15 text-accent',
                  hover.state.status === 'low-match' &&
                    'bg-muted text-muted-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {statusLabel(hover.state.status)}
              </span>
            </div>
            <div className="mt-1 text-muted-foreground">
              ICP match:{' '}
              <span className="font-medium text-foreground">
                {hover.state.icpMatch}%
              </span>
            </div>
            <div className="text-muted-foreground">
              Predicted scan:{' '}
              <span className="font-medium text-foreground">
                {hover.state.predictedScanRate}%
              </span>
            </div>
            <div className="text-muted-foreground">
              Top city:{' '}
              <span className="font-medium text-foreground">
                {hover.state.topCity}
              </span>
            </div>
            {hover.state.deliveries ? (
              <div className="text-muted-foreground">
                Deliveries:{' '}
                <span className="font-medium text-foreground">
                  {hover.state.deliveries.toLocaleString()}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Swatch({ fill, label }: { fill: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm border border-border"
        style={{ background: fill }}
      />
      {label}
    </span>
  );
}
