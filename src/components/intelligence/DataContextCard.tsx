'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ITEMS = [
  '847 customer ICP profiles',
  'Flavor × food affinity matrix',
  'Scan rates by neighborhood',
  'Taste preference scores',
  'Purchase intent data',
];

export function DataContextCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="nibl-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-[12px] text-foreground hover:bg-muted"
      >
        <span>📊 Data sources active</span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open ? (
        <ul className="space-y-1 border-t border-border px-4 py-3 text-[12px]">
          {ITEMS.map((label) => (
            <li key={label} className="flex items-center gap-2 text-foreground">
              <span className="text-success">✓</span>
              {label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
