'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from './_theme';
import { donutPalette as palette } from './donut-palette';

type Slice = { name: string; value: number };

export function DonutChart({
  data,
  height = 320,
}: {
  data: Slice[];
  height?: number;
}) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No data.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipContentStyle}
          labelStyle={tooltipLabelStyle}
          itemStyle={tooltipItemStyle}
          formatter={(value: number, name: string) => [`${value}%`, name]}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={80}
          outerRadius={130}
          paddingAngle={1.5}
          stroke="#000"
          strokeWidth={1}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
