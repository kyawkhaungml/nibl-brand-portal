export const chartTheme = {
  accent: '#FF5C25',
  accentSoft: 'rgba(255, 92, 37, 0.18)',
  benchmark: '#A1A1AA',
  grid: '#EFEFEF',
  axis: '#666',
  tooltipBg: '#FFFFFF',
  tooltipBorder: '#000000',
  tooltipText: '#000000',
};

export const tooltipContentStyle: React.CSSProperties = {
  backgroundColor: chartTheme.tooltipBg,
  border: `1px solid ${chartTheme.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 12,
  padding: '6px 10px',
  boxShadow: '2px 2px 0 0 #000',
  color: chartTheme.tooltipText,
};

export const tooltipLabelStyle: React.CSSProperties = {
  color: chartTheme.tooltipText,
};

export const tooltipItemStyle: React.CSSProperties = {
  color: chartTheme.tooltipText,
};

export const axisStyle = {
  fontSize: 11,
  fill: chartTheme.axis,
};
