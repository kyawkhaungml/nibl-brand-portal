'use client';

import {
  Area,
  AreaChart as RAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  axisStyle,
  chartTheme,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from './_theme';

type Datum = { date: string; pairings: number };

function formatLabel(d: string): string {
  const [m, day] = d.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = Number(m) - 1;
  if (idx < 0 || idx > 11) return d;
  return `${months[idx]} ${Number(day)}`;
}

export function AreaChart({
  data,
  height = 260,
}: {
  data: Datum[];
  height?: number;
}) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No data for this range.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="pairings-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartTheme.accent} stopOpacity={0.22} />
            <stop offset="100%" stopColor={chartTheme.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tickFormatter={(v: string) => formatLabel(v)}
        />
        <YAxis
          tick={axisStyle}
          tickLine={false}
          axisLine={false}
          width={32}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelStyle={tooltipLabelStyle}
          itemStyle={tooltipItemStyle}
          cursor={{ stroke: chartTheme.accent, strokeOpacity: 0.4 }}
          labelFormatter={(v) => formatLabel(String(v))}
          formatter={(value: number) => [`${value} deliveries`, '']}
        />
        <Area
          type="monotone"
          dataKey="pairings"
          stroke={chartTheme.accent}
          strokeWidth={2}
          fill="url(#pairings-fill)"
        />
      </RAreaChart>
    </ResponsiveContainer>
  );
}
