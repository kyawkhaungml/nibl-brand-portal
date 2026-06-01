'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useUserCampaigns } from '@/lib/use-user-campaigns';
import { useBrand } from '@/components/brand/brand-context';
import { kaceMockData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { BrandCampaign } from '@/types';

const VARIANTS = [
  'Yuzu',
  'Yuzu Mint',
  'Hibiscus Lime',
  'Yuzu Ginger',
  'Cold Brew Tonic',
];

const GEO_STATES = kaceMockData.geoBreakdown;

const STATUS_ORDER: Record<string, number> = {
  active: 0,
  opportunity: 1,
  'low-match': 2,
};
const SORTED_STATES = [...GEO_STATES].sort(
  (a, b) =>
    (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
);

function citiesForState(code: string): string[] {
  const s = GEO_STATES.find((x) => x.code === code);
  if (!s) return [];
  if (s.code === 'NY') return [s.topCity];
  return s.cities?.map((c) => c.name) ?? [];
}

const NYC_NEIGHBORHOODS = (
  GEO_STATES.find((s) => s.code === 'NY')?.neighborhoods ?? []
).map((n) => n.neighborhood);

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function autoPromo(name: string): string {
  const stripped = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  return stripped ? `${stripped}10` : '';
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  if (Number.isNaN(da) || Number.isNaN(db)) return 0;
  return Math.max(0, Math.round((db - da) / (1000 * 60 * 60 * 24)));
}

export function CreateCampaignModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const brand = useBrand();
  const { addCampaign } = useUserCampaigns();
  const minDate = useMemo(() => tomorrowIso(), []);

  const [name, setName] = useState('');
  const [drinkName, setDrinkName] = useState('');
  const [pickedVariants, setPickedVariants] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState('');
  const [ongoing, setOngoing] = useState(false);
  const [samples, setSamples] = useState<number | ''>(500);
  const [cost, setCost] = useState<number | ''>(2.5);
  const [pickedStates, setPickedStates] = useState<string[]>([]);
  const [pickedCities, setPickedCities] = useState<string[]>([]);
  const [pickedHoods, setPickedHoods] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoTouched, setPromoTouched] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggleVariant(v: string) {
    setPickedVariants((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }
  function toggleState(code: string) {
    setPickedStates((prev) => {
      if (prev.includes(code)) {
        const cities = citiesForState(code);
        setPickedCities((p) => p.filter((c) => !cities.includes(c)));
        if (code === 'NY') setPickedHoods([]);
        return prev.filter((x) => x !== code);
      }
      return [...prev, code];
    });
  }
  function toggleCity(name: string) {
    setPickedCities((prev) => {
      if (prev.includes(name)) {
        if (name === 'New York City') setPickedHoods([]);
        return prev.filter((x) => x !== name);
      }
      return [...prev, name];
    });
  }
  function toggleHood(h: string) {
    setPickedHoods((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h],
    );
  }

  function onNameChange(v: string) {
    setName(v);
    if (!promoTouched) setPromoCode(autoPromo(v));
  }

  const samplesNum = samples === '' ? 0 : samples;
  const costNum = cost === '' ? 0 : cost;
  const totalSpend = samplesNum * costNum;
  const duration = ongoing || !endDate ? 0 : daysBetween(startDate, endDate);

  const valid =
    name.trim().length > 0 &&
    drinkName.trim().length > 0 &&
    pickedVariants.length > 0 &&
    samplesNum >= 100 &&
    costNum > 0 &&
    !!startDate &&
    (ongoing || !!endDate);

  function reset() {
    setName('');
    setDrinkName('');
    setPickedVariants([]);
    setStartDate(minDate);
    setEndDate('');
    setOngoing(false);
    setSamples(500);
    setCost(2.5);
    setPickedStates([]);
    setPickedCities([]);
    setPickedHoods([]);
    setPromoCode('');
    setPromoTouched(false);
    setNotes('');
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newCampaign: BrandCampaign = {
      id,
      brandId: brand.id,
      name: name.trim(),
      drinkName: drinkName.trim(),
      drinkVariants: pickedVariants,
      startDate,
      endDate: ongoing ? null : endDate,
      status: 'pending',
      totalBudget: samples === '' ? 0 : samples,
      costPerSample: cost === '' ? 0 : cost,
      samplesUsed: 0,
      extras: {
        targetStates: pickedStates,
        targetCities: pickedCities,
        targetNeighborhoods: pickedHoods,
        promoCode: promoCode.trim(),
        notes: notes.trim(),
      },
    };
    addCampaign(newCampaign);
    toast.show(
      '✓ Campaign created! Your NiBL team will review within 24 hours.',
      'success',
    );
    onClose();
    reset();
    setSubmitting(false);
    router.push(`/campaigns/${id}`);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create campaign"
      subtitle="Submit a new sampling campaign for NiBL review."
      maxWidth="600px"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Campaign name" htmlFor="cc-name">
          <input
            id="cc-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Fall Launch 2026"
            required
            className={inputCls}
          />
        </Field>

        <Field label="Product / drink name" htmlFor="cc-drink">
          <input
            id="cc-drink"
            type="text"
            value={drinkName}
            onChange={(e) => setDrinkName(e.target.value)}
            placeholder="e.g. Kace Sparkling Yuzu"
            required
            className={inputCls}
          />
        </Field>

        <Field label="Variants to include">
          <div className="mt-1 flex flex-wrap gap-2">
            {VARIANTS.map((v) => (
              <Chip
                key={v}
                active={pickedVariants.includes(v)}
                onClick={() => toggleVariant(v)}
              >
                {v}
              </Chip>
            ))}
          </div>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Start date" htmlFor="cc-start">
            <input
              id="cc-start"
              type="date"
              min={minDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="End date" htmlFor="cc-end">
            <input
              id="cc-end"
              type="date"
              min={startDate || minDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={ongoing}
              required={!ongoing}
              className={cn(inputCls, ongoing && 'opacity-50')}
            />
            <label className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                checked={ongoing}
                onChange={(e) => setOngoing(e.target.checked)}
                className="h-3 w-3"
              />
              Ongoing (no end date)
            </label>
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Total samples" htmlFor="cc-samples">
            <input
              id="cc-samples"
              type="number"
              min={100}
              step={100}
              value={samples}
              onChange={(e) => {
                const v = e.target.value;
                setSamples(v === '' ? '' : Number(v));
              }}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Cost per sample ($)" htmlFor="cc-cost">
            <input
              id="cc-cost"
              type="number"
              min={0.1}
              step={0.1}
              value={cost}
              onChange={(e) => {
                const v = e.target.value;
                setCost(v === '' ? '' : Number(v));
              }}
              required
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Target states">
          <div className="mt-1 flex flex-wrap gap-2">
            {SORTED_STATES.map((s) => (
              <Chip
                key={s.code}
                active={pickedStates.includes(s.code)}
                onClick={() => toggleState(s.code)}
              >
                <span
                  aria-hidden
                  className={cn(
                    'mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle',
                    s.status === 'active' && 'bg-emerald-500',
                    s.status === 'opportunity' && 'bg-amber-500',
                    s.status === 'low-match' && 'bg-gray-400',
                  )}
                />
                {s.code}
              </Chip>
            ))}
          </div>
        </Field>

        {pickedStates.length > 0 ? (
          <Field label="Target cities">
            <div className="mt-1 space-y-2">
              {pickedStates.map((code) => {
                const state = GEO_STATES.find((s) => s.code === code);
                const cities = citiesForState(code);
                if (!state || cities.length === 0) return null;
                return (
                  <div key={code}>
                    <div className="text-[11px] text-muted-foreground">
                      {state.name}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {cities.map((c) => (
                        <Chip
                          key={c}
                          active={pickedCities.includes(c)}
                          onClick={() => toggleCity(c)}
                        >
                          {c}
                        </Chip>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Field>
        ) : null}

        {pickedCities.includes('New York City') &&
        NYC_NEIGHBORHOODS.length > 0 ? (
          <Field label="Target neighborhoods (NYC)">
            <div className="mt-1 flex flex-wrap gap-2">
              {NYC_NEIGHBORHOODS.map((h) => (
                <Chip
                  key={h}
                  active={pickedHoods.includes(h)}
                  onClick={() => toggleHood(h)}
                >
                  {h}
                </Chip>
              ))}
            </div>
          </Field>
        ) : null}

        <Field label="Promo code" htmlFor="cc-promo">
          <input
            id="cc-promo"
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoTouched(true);
              setPromoCode(e.target.value.toUpperCase());
            }}
            placeholder="e.g. FALL10"
            className={cn(inputCls, 'font-mono')}
          />
          <div className="mt-1 text-[11px] text-muted-foreground">
            Auto-suggested from campaign name; edit anytime.
          </div>
        </Field>

        <Field label="Notes (optional)" htmlFor="cc-notes">
          <textarea
            id="cc-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything NiBL should know?"
            className={cn(inputCls, 'resize-none')}
          />
        </Field>

        <div className="rounded-lg border border-border bg-muted p-3 text-[12px] text-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Total spend:{' '}
              <span className="font-semibold text-accent">
                ${totalSpend.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </span>
            {duration > 0 ? (
              <span>
                Duration:{' '}
                <span className="font-semibold text-foreground">
                  {duration} days
                </span>
              </span>
            ) : null}
            {pickedStates.length + pickedCities.length + pickedHoods.length >
            0 ? (
              <span>
                Targeting{' '}
                <span className="font-semibold text-foreground">
                  {[
                    pickedStates.length &&
                      `${pickedStates.length} state${
                        pickedStates.length === 1 ? '' : 's'
                      }`,
                    pickedCities.length &&
                      `${pickedCities.length} ${
                        pickedCities.length === 1 ? 'city' : 'cities'
                      }`,
                    pickedHoods.length &&
                      `${pickedHoods.length} neighborhood${
                        pickedHoods.length === 1 ? '' : 's'
                      }`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={!valid || submitting}
            className={cn(
              'w-full rounded-lg border border-foreground px-4 py-2 text-sm font-medium shadow-flat transition-all',
              valid && !submitting
                ? 'bg-accent text-accent-foreground hover:-translate-y-px hover:shadow-flat-lg'
                : 'cursor-not-allowed bg-muted text-muted-foreground',
            )}
          >
            {submitting ? 'Submitting…' : 'Submit campaign for review'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-center text-[12px] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls =
  'mt-1 w-full rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-soft focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 disabled:cursor-not-allowed';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[12px] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-[12px] transition-colors',
        active
          ? 'border-accent bg-accent/15 text-accent'
          : 'border-border bg-card text-foreground hover:border-accent',
      )}
    >
      {children}
    </button>
  );
}
