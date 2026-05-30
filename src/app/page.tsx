import { redirect } from 'next/navigation';
import { env } from '@/lib/env';
import { getSupabaseServer } from '@/lib/supabase/server';

export default async function RootPage() {
  if (!env.supabase.url || !env.supabase.anonKey) {
    redirect(env.useMockData ? '/dashboard' : '/login');
  }
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  redirect(user ? '/dashboard' : '/login');
}
