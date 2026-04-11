import { SectionReveal } from '@/components/ui/SectionReveal';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:px-10 lg:px-16 lg:pb-28 lg:pt-36">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(45,107,255,0.18),transparent_46%),radial-gradient(circle_at_80%_35%,rgba(45,107,255,0.1),transparent_42%),linear-gradient(180deg,#0A0B0D_0%,#090A0C_100%)] bg-[length:180%_180%] animate-gradient-shift" />
      </div>

      <SectionReveal className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Personal Operating Interface</p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.03] text-text sm:text-6xl lg:text-7xl">
          Designing systems that turn research into disciplined execution.
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          A premium minimal personal site focused on methodology, measurable project outcomes, and transparent versioned progress.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] hover:shadow-focus"
          >
            Explore Projects
          </a>
          <span className="text-sm text-muted">Content-first. Precise motion. Controlled visual rhythm.</span>
        </div>
      </SectionReveal>
    </section>
  );
}
