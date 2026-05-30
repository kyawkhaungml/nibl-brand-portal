'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const invite = params.get('invite') ?? '';

  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteOk, setInviteOk] = useState(false);

  useEffect(() => {
    setInviteOk(invite.trim().length > 0);
  }, [invite]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!inviteOk) {
      setError('A valid ?invite=… token is required to sign up.');
      return;
    }
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      setLoading(false);
      setError(error?.message ?? 'Signup failed.');
      return;
    }
    const { error: insertError } = await supabase.from('brand_partners').insert({
      supabase_user_id: data.user.id,
      name: brandName,
      email,
    });
    setLoading(false);
    if (insertError) {
      setError(`Account created but brand row failed: ${insertError.message}`);
      return;
    }
    router.replace('/dashboard');
  }

  return (
    <form onSubmit={onSubmit} className="nibl-card w-full max-w-sm space-y-4 p-6">
      <div>
        <div className="nibl-wordmark text-display-xl leading-none">NiBL</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
          Activate your brand portal invite
        </div>
      </div>
      {!inviteOk ? (
        <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs">
          Signup is invite-only. Append <code>?invite=&lt;token&gt;</code> to the
          URL from your NiBL invitation email.
        </p>
      ) : null}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Brand name</label>
        <Input
          required
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Kace Beverages"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Email</label>
        <Input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Password</label>
        <Input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-accent underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
