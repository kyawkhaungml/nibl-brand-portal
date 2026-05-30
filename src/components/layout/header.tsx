'use client';

import { useBrand } from '@/components/brand/brand-context';

export function Header() {
  const brand = useBrand();
  return (
    <header className="flex items-center justify-between border-b border-foreground bg-background px-5 py-3">
      <div className="md:hidden">
        <div className="nibl-wordmark text-xl text-foreground">NiBL</div>
        <div className="text-[10px] text-muted-foreground">Brand Portal</div>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium leading-tight text-foreground">
            {brand.name}
          </div>
          <div className="text-[11px] text-muted-foreground">{brand.email}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground bg-accent/15 text-sm font-medium text-accent">
          {brand.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
