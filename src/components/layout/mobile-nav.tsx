'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, Settings, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Overview', icon: Home, matches: ['/dashboard', '/pairing-insights'] },
  { href: '/campaigns', label: 'Campaign', icon: Target, matches: ['/campaigns'] },
  { href: '/taste-analytics', label: 'Audience', icon: Users, matches: ['/taste-analytics'] },
  { href: '/intelligence', label: 'Intel', icon: Brain, matches: ['/intelligence'] },
  { href: '/settings', label: 'Settings', icon: Settings, matches: ['/settings'] },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-foreground bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      {items.map(({ href, label, icon: Icon, matches }) => {
        const active = matches.some(
          (m) => pathname === m || (m !== '/' && pathname.startsWith(m)),
        );
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 py-2 text-[10px]',
              active ? 'text-accent' : 'text-muted-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
