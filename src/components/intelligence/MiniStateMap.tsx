'use client';

import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { FIPS_TO_STATE } from '@/lib/us-states';
import type { StateScore } from '@/lib/intelligence/types';

function fillFor(score: number): string {
  if (score >= 90) return '#FF5C25';
  if (score >= 80) return 'rgba(255, 92, 37, 0.7)';
  if (score >= 65) return 'rgba(255, 92, 37, 0.45)';
  if (score >= 50) return 'rgba(255, 92, 37, 0.22)';
  return 'rgba(255, 92, 37, 0.1)';
}

export function MiniStateMap({
  states,
  caption,
}: {
  states: StateScore[];
  caption?: string;
}) {
  const scoreByCode = useMemo(() => {
    const m = new Map<string, number>();
    states.forEach((s) => m.set(s.code, s.score));
    return m;
  }, [states]);

  return (
    <div>
      <div className="mx-auto max-w-[320px]">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 580 }}
          width={320}
          height={180}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography="/maps/us-states-10m.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = FIPS_TO_STATE[String(geo.id).padStart(2, '0')];
                const score = code ? scoreByCode.get(code) : undefined;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={score != null ? fillFor(score) : '#F0F0EE'}
                    stroke="#FFFFFF"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div className="mt-1.5 text-center text-[11px] text-muted-foreground">
        {caption ??
          states
            .slice()
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((s) => (
              <span key={s.code}>
                <span className="text-foreground">{s.code}</span> {s.score}%
              </span>
            ))
            .reduce<React.ReactNode[]>((acc, el, i) => {
              if (i > 0) acc.push(' · ');
              acc.push(el);
              return acc;
            }, [])}
      </div>
    </div>
  );
}
