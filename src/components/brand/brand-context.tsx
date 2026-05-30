'use client';

import { createContext, useContext } from 'react';
import type { BrandPartner } from '@/types';

const BrandContext = createContext<BrandPartner | null>(null);

export function BrandProvider({
  brand,
  children,
}: {
  brand: BrandPartner;
  children: React.ReactNode;
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandPartner {
  const v = useContext(BrandContext);
  if (!v) throw new Error('useBrand must be used inside <BrandProvider>');
  return v;
}
