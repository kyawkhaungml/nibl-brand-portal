import 'server-only';

import { redirect } from 'next/navigation';
import { env } from './env';
import { kaceMockData } from './mock-data';
import { getSupabaseServer } from './supabase/server';
import type { BrandPartner } from '@/types';

function supabaseConfigured(): boolean {
  return Boolean(env.supabase.url && env.supabase.anonKey);
}

export async function getCurrentBrand(): Promise<BrandPartner> {
  if (!supabaseConfigured()) {
    if (env.useMockData) return kaceMockData.brand;
    throw new Error('Supabase is not configured and mock data is disabled.');
  }

  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (env.useMockData) return kaceMockData.brand;
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('brand_partners')
    .select('id, name, email, logo_url, supabase_user_id, created_at')
    .eq('supabase_user_id', user.id)
    .single();

  if (error || !data) {
    if (env.useMockData) {
      return { ...kaceMockData.brand, email: user.email ?? kaceMockData.brand.email };
    }
    redirect('/login?error=no-brand');
  }

  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    logoUrl: (data.logo_url as string | null) ?? null,
    supabaseUserId: data.supabase_user_id as string,
    createdAt: data.created_at as string,
  };
}

export async function getCurrentBrandId(): Promise<string> {
  const brand = await getCurrentBrand();
  return brand.id;
}
