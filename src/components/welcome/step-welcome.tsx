export function StepWelcome() {
  return (
    <div className="space-y-8 text-center">
      <div className="relative inline-block animate-in fade-in zoom-in-95 fill-mode-both duration-700 delay-200">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/30 blur-2xl"
        />
        <div className="nibl-wordmark text-[64px] leading-none text-accent">
          NiBL
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[600ms] font-heading text-display-2xl text-foreground">
          Welcome to Brand Intelligence
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[800ms] text-sm text-muted-foreground">
          The home for CPG beverage brands sampling through NiBL.
        </p>
      </div>

      <p className="mx-auto max-w-md animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-[1000ms] text-[15px] leading-relaxed text-foreground">
        NiBL is a NYC food-delivery platform that pairs craft beverage samples
        with food orders. This portal is your real-time window into how your
        drink is performing —{' '}
        <span className="font-medium text-accent">who&apos;s tasting it</span>,{' '}
        <span className="font-medium text-accent">where</span>, and{' '}
        <span className="font-medium text-accent">what they do next</span>.
      </p>
    </div>
  );
}
