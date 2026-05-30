'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  LogOut,
  Settings,
  Target,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: Home, matches: ['/dashboard', '/pairing-insights'] },
  { href: '/campaigns', label: 'My Campaign', icon: Target, matches: ['/campaigns'] },
  { href: '/taste-analytics', label: 'Audience', icon: Users, matches: ['/taste-analytics'] },
  { href: '/settings', label: 'Settings', icon: Settings, matches: ['/settings'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await getSupabaseBrowser().auth.signOut();
    router.replace('/login');
  }

  return (
    <aside className="hidden w-60 shrink-0 border-r border-foreground bg-card md:flex md:flex-col">
      <div className="border-b border-foreground p-5">
        <div className="nibl-wordmark text-2xl text-foreground">NiBL</div>
        <div className="mt-1 text-xs text-muted-foreground">Brand Portal</div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ href, label, icon: Icon, matches }) => {
          const active = matches.some(
            (m) => pathname === m || (m !== '/' && pathname.startsWith(m)),
          );
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-accent/15 text-accent border border-accent'
                  : 'text-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={logout}
        className="m-3 flex items-center gap-2 rounded-lg border border-foreground bg-background px-3 py-2 text-sm shadow-flat hover:-translate-y-px hover:shadow-flat-lg"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}
