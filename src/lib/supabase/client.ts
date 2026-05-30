'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env } from '../env';

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (cached) return cached;
  cached = createBrowserClient(env.supabase.url, env.supabase.anonKey);
  return cached;
}
