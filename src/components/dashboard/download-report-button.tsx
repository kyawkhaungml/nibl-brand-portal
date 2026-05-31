'use client';

import { useEffect, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import type {
  CampaignBenchmark,
  PairingSummary,
  TasteDimension,
} from '@/types';

// Inline subset of taste dimensions used by the report (matches what's on
// /taste-analytics; hardcoded here so the dashboard doesn't need a new fetch).
const DEFAULT_TASTE_BARS: TasteDimension[] = [
  { key: 'citrus', label: 'Citrus preference', score: 81 },
  { key: 'carbonation', label: 'Carbonation', score: 76 },
  { key: 'spice', label: 'Spice tolerance', score: 72 },
  { key: 'sweet', label: 'Sweet affinity', score: 68 },
];

function fmtDate(d: Date = new Date()): string {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function deltaText(delta: number): { text: string; cls: string } {
  const positive = delta > 0;
  const sign = positive ? '↑ +' : '↓ ';
  return {
    text: `${sign}${Math.abs(delta).toFixed(1)}%`,
    cls: positive ? 'text-success' : 'text-destructive',
  };
}

export function DownloadReportButton({
  summary,
  benchmark,
  brandName,
}: {
  summary: PairingSummary;
  benchmark: CampaignBenchmark[];
  brandName: string;
}) {
  const [open, setOpen] = useState(false);

  // Inject print-only CSS while the modal is mounted so window.print()
  // outputs ONLY the report content.
  useEffect(() => {
    if (!open) return;
    const style = document.createElement('style');
    style.id = 'nibl-print-isolate';
    style.textContent = `
      @media print {
        body > *:not(#nibl-export-portal) { display: none !important; }
        #nibl-export-portal { position: static !important; display: block !important; }
        #nibl-export-portal .nibl-no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [open]);

  const today = fmtDate();
  const month = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent print:hidden"
      >
        <Download className="h-3.5 w-3.5" />
        Download report
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        maxWidth="680px"
        portalId="nibl-export-portal"
        bodyClassName="px-8 py-8"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2 nibl-no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-foreground bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground shadow-flat hover:-translate-y-px hover:shadow-flat-lg"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-foreground bg-background px-3 py-1.5 text-xs"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="nibl-wordmark text-2xl text-accent">NiBL</div>
            <div className="text-xs text-muted-foreground">Brand Portal</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">{brandName}</div>
            <div className="text-xs text-muted-foreground">
              {month} · 30 day report
            </div>
          </div>
        </div>

        <hr className="my-4 border-t border-border" />

        <Section title="Campaign overview">
          <div className="grid grid-cols-2 gap-3">
            <KpiBox
              label="Drinks delivered"
              value={summary.totalPairings.toLocaleString()}
              delta={summary.totalPairingsDelta}
            />
            <KpiBox
              label="QR scan rate"
              value={`${summary.scanRate}%`}
              delta={summary.scanRateDelta}
            />
            <KpiBox
              label="Avg rating"
              value={`${summary.avgRating.toFixed(1)} / 5`}
              delta={summary.avgRatingDelta}
            />
            <KpiBox
              label="Would buy again"
              value={`${summary.purchaseIntent}%`}
              delta={summary.purchaseIntentDelta}
            />
          </div>
        </Section>

        <Section title="Key highlights">
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
            <li>Yuzu flavor leads with 74% scan rate and 4.8★ rating</li>
            <li>East Village is top neighborhood at 75% scan rate</li>
            <li>You rank #2 of 12 brands in NYC beverage category</li>
          </ul>
        </Section>

        <Section title="Audience snapshot">
          <div className="space-y-2">
            {DEFAULT_TASTE_BARS.map((d) => (
              <div key={d.key} className="flex items-center gap-3 text-xs">
                <span className="w-32 text-foreground">{d.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                <span className="w-10 text-right tabular-nums text-foreground">
                  {d.score}%
                </span>
              </div>
            ))}
            {benchmark.length ? (
              <p className="pt-2 text-[11px] text-muted-foreground">
                Brand vs NiBL avg: scan {benchmark.find((b) => b.metric === 'Scan rate')?.brand ?? '—'}% vs {benchmark.find((b) => b.metric === 'Scan rate')?.benchmark ?? '—'}% · rating {benchmark.find((b) => b.metric === 'Avg rating')?.brand?.toFixed(1) ?? '—'} vs {benchmark.find((b) => b.metric === 'Avg rating')?.benchmark?.toFixed(1) ?? '—'}
              </p>
            ) : null}
          </div>
        </Section>

        <div className="mt-6 border-t border-border pt-3 text-center">
          <div className="text-[11px] text-muted-foreground">
            Powered by NiBL Brand Intelligence · nibl.food
          </div>
          <div className="mt-0.5 text-[10px] text-muted-foreground">
            Generated {today}
          </div>
        </div>
      </Modal>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      {children}
    </section>
  );
}

function KpiBox({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: number;
}) {
  const d = deltaText(delta);
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`mt-1 text-[11px] ${d.cls}`}>{d.text}</div>
    </div>
  );
}
