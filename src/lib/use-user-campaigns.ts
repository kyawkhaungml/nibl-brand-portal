'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { BrandCampaign } from '@/types';

const STORAGE_KEY = 'nibl:user-campaigns';

function readFromStorage(): BrandCampaign[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BrandCampaign[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(list: BrandCampaign[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors during demo
  }
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}
function notify() {
  listeners.forEach((cb) => cb());
}

const EMPTY: BrandCampaign[] = [];

// Cache the parsed snapshot keyed off the raw localStorage string so
// useSyncExternalStore receives a stable reference across renders. Without
// this, every render parses JSON afresh and returns a new array, which
// React treats as "state changed" → infinite re-render loop.
let cachedRaw: string | null = '__unset__';
let cachedSnapshot: BrandCampaign[] = EMPTY;

function getSnapshot(): BrandCampaign[] {
  if (typeof window === 'undefined') return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  if (!raw) {
    cachedSnapshot = EMPTY;
    return cachedSnapshot;
  }
  try {
    const parsed = JSON.parse(raw);
    cachedSnapshot = Array.isArray(parsed) ? (parsed as BrandCampaign[]) : EMPTY;
  } catch {
    cachedSnapshot = EMPTY;
  }
  return cachedSnapshot;
}
function getServerSnapshot(): BrandCampaign[] {
  return EMPTY;
}

export function useUserCampaigns() {
  const userCampaigns = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addCampaign = useCallback((c: BrandCampaign) => {
    const next = [c, ...readFromStorage().filter((x) => x.id !== c.id)];
    writeToStorage(next);
    notify();
  }, []);

  const removeCampaign = useCallback((id: string) => {
    const next = readFromStorage().filter((x) => x.id !== id);
    writeToStorage(next);
    notify();
  }, []);

  return { userCampaigns, addCampaign, removeCampaign };
}
