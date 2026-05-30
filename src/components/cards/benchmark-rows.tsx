import { ArrowDown, ArrowUp } from 'lucide-react';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { CampaignBenchmark } from '@/types';

function scaleTo100(metric: CampaignBenchmark['metric'], value: number): number {
  // Rating is on a 0-5 scale; everything else is already 0-100.
  return metric === 'Avg rating' ? (value / 5) * 100 : value;
}

function formatValue(metric: CampaignBenchmark['metric'], value: number): string {
  return metric === 'Avg rating' ? value.toFixed(1) : `${value}%`;
}

export function BenchmarkRows({ data }: { data: CampaignBenchmark[] }) {
  return (
    <div className="nibl-card p-5">
      <div className="mb-4 text-sm font-medium text-foreground">
        Performance vs NiBL benchmark
      </div>
      <div className="space-y-4">
        {data.map((row) => {
          const above = row.brand >= row.benchmark;
          return (
            <div key={row.metric}>
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="text-foreground">{row.metric}</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground">
                    {formatValue(row.metric, row.brand)}
                  </span>
                  {' · NiBL avg '}
                  {formatValue(row.metric, row.benchmark)}{' '}
                  <span
                    className={
                      above ? 'text-success' : 'text-accent'
                    }
                  >
                    {above ? (
                      <ArrowUp className="inline h-3 w-3" />
                    ) : (
                      <ArrowDown className="inline h-3 w-3" />
                    )}{' '}
                    {above ? 'above avg' : 'below avg'}
                  </span>
                </span>
              </div>
              <ProgressBar
                value={scaleTo100(row.metric, row.brand)}
                tone={above ? 'success' : 'accent'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
