import type { Metadata } from 'next';
import { Inter, Fraunces, Bowlby_One } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-fallback',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-heading-fallback',
  display: 'swap',
  axes: ['opsz'],
});
const bowlbyOne = Bowlby_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display-fallback',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NiBL Brand Portal',
    template: '%s · NiBL Brand Portal',
  },
  description: 'Pairing insights and campaign performance for NiBL beverage partners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${bowlbyOne.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
