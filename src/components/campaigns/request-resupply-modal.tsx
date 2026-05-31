'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { kaceMockData } from '@/lib/mock-data';

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function RequestResupplyModal({
  isOpen,
  onClose,
  onSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const toast = useToast();
  const minDate = useMemo(() => tomorrowIso(), []);
  const flavors = useMemo(
    () =>
      [...kaceMockData.drinkVariants].sort(
        (a, b) => b.pairings - a.pairings,
      ),
    [],
  );

  const [quantity, setQuantity] = useState(500);
  const [date, setDate] = useState(minDate);
  const [flavor, setFlavor] = useState(flavors[0]?.variant ?? '');
  const [notes, setNotes] = useState('');

  function reset() {
    setQuantity(500);
    setDate(minDate);
    setFlavor(flavors[0]?.variant ?? '');
    setNotes('');
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!quantity || quantity < 100) return;
    onSubmitted?.();
    onClose();
    reset();
    toast.show(
      '✓ Request submitted! Your NiBL account manager will follow up within 24 hours.',
      'success',
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request sample resupply"
      subtitle="Your account manager will confirm within 24 hours"
      maxWidth="520px"
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="rsp-qty" className="block text-[12px] text-muted-foreground">
            Quantity needed
          </label>
          <input
            id="rsp-qty"
            type="number"
            min={100}
            step={100}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Minimum 100 samples per request
          </p>
        </div>

        <div>
          <label htmlFor="rsp-date" className="block text-[12px] text-muted-foreground">
            Preferred delivery date
          </label>
          <input
            id="rsp-date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15"
          />
        </div>

        <div>
          <label htmlFor="rsp-flavor" className="block text-[12px] text-muted-foreground">
            Priority flavor
          </label>
          <select
            id="rsp-flavor"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            className="mt-1 w-full rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15"
          >
            {flavors.map((v, i) => (
              <option key={v.variant} value={v.variant}>
                {v.variant}
                {i === 0 ? ' (top performer ★)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rsp-notes" className="block text-[12px] text-muted-foreground">
            Notes (optional)
          </label>
          <textarea
            id="rsp-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requirements or delivery instructions?"
            className="mt-1 w-full resize-none rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-lg border border-foreground bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-flat transition-all hover:-translate-y-px hover:shadow-flat-lg"
          >
            Submit request
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 block w-full text-center text-[12px] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function RequestResupplyTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="-mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[12px] font-medium text-accent hover:underline"
        >
          Request resupply →
        </button>
      </div>
      <RequestResupplyModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
