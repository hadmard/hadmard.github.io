import { Container } from '@/components/layout/Container';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function HeroSection() {
  return (
    <section id="top" className="px-6 pb-24 pt-28 sm:px-10 lg:px-16 lg:pb-32 lg:pt-40">
      <Container>
        <SectionReveal>
          <p className="research-kicker">Quantitative Research System</p>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[1.06] text-text sm:text-6xl lg:text-7xl">
            Precision compounds.
          </h1>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center border border-line bg-transparent px-6 py-2.5 text-sm text-[#dbe5f8] transition-colors duration-200 hover:border-accent hover:text-white"
            >
              View Work
            </a>
            <span className="text-sm text-muted">Model, verify, iterate.</span>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
