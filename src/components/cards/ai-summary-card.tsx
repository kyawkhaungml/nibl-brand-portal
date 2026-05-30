'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AISummaryCard({
  endpoint,
  payload,
  title = 'Campaign insight',
}: {
  endpoint: string;
  payload: unknown;
  title?: string;
}) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { insight?: string }) => {
        if (cancelled) return;
        if (data.insight && data.insight.trim()) {
          setText(data.insight.trim());
        } else {
          setFailed(true);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          console.error('AI summary fetch failed', e);
          setFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, payload]);

  // Brand partners never see an error UI — hide the entire card on failure.
  if (failed) return null;

  return (
    <div className="nibl-hero p-5">
      <div className="mb-2 flex items-center gap-2 text-[12px] text-accent">
        <Sparkles className="h-3.5 w-3.5" />
        {title}
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <p className="text-[15px] leading-relaxed text-foreground">{text}</p>
      )}
    </div>
  );
}
