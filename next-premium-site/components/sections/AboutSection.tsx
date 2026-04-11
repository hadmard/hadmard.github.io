import { SectionReveal } from '@/components/ui/SectionReveal';

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <SectionReveal className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">About</h2>
        <p className="text-base leading-8 text-muted sm:text-lg">
          I build interfaces and systems that favor clarity over spectacle. My work sits at the intersection of product architecture,
          execution discipline, and long-horizon learning. This site is intentionally minimal: fewer elements, stronger decisions,
          and transparent evolution through versioned releases.
        </p>
      </SectionReveal>
    </section>
  );
}
