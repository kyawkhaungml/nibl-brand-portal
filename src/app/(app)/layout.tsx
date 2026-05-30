import { BrandProvider } from '@/components/brand/brand-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { getCurrentBrand } from '@/lib/brand';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getCurrentBrand();
  return (
    <BrandProvider brand={brand}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">{children}</main>
        </div>
        <MobileNav />
      </div>
    </BrandProvider>
  );
}
