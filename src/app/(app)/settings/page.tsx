'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBrand } from '@/components/brand/brand-context';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export default function SettingsPage() {
  const brand = useBrand();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (password.length < 8) {
      setStatus({ ok: false, message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setStatus({ ok: false, message: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    const { error } = await getSupabaseBrowser().auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setStatus({ ok: false, message: error.message });
      return;
    }
    setStatus({ ok: true, message: 'Password updated.' });
    setPassword('');
    setConfirm('');
  }

  async function signOut() {
    await getSupabaseBrowser().auth.signOut();
    router.replace('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-display-xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your brand account.</p>
      </div>

      <div className="nibl-card space-y-2 p-4">
        <div className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
          Brand
        </div>
        <div className="text-sm font-medium">{brand.name}</div>
        <div className="text-sm text-muted-foreground">{brand.email}</div>
      </div>

      <form onSubmit={changePassword} className="nibl-card space-y-3 p-4">
        <div className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
          Change password
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground" htmlFor="pw">
            New password
          </label>
          <Input
            id="pw"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground" htmlFor="pw2">
            Confirm
          </label>
          <Input
            id="pw2"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {status ? (
          <p className={status.ok ? 'text-xs text-success' : 'text-xs text-destructive'}>
            {status.message}
          </p>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>

      <div className="nibl-card flex items-center justify-between p-4">
        <div>
          <div className="font-medium">Sign out</div>
          <div className="text-xs text-muted-foreground">End this session.</div>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
