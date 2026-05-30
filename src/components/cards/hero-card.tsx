export function HeroCard({
  customers,
  scanRate,
  rating,
}: {
  customers: number;
  scanRate: number;
  rating: number;
}) {
  return (
    <section className="nibl-hero p-7 md:p-9">
      <h1 className="font-heading text-2xl leading-tight text-foreground md:text-3xl">
        Your drink reached{' '}
        <span className="text-[40px] font-bold text-accent md:text-[48px]">
          {customers.toLocaleString()}
        </span>{' '}
        customers this month
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {scanRate}% scanned the QR · {rating.toFixed(1)}★ avg rating
      </p>
      <a
        href="#daily-reach"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        View full breakdown →
      </a>
    </section>
  );
}
