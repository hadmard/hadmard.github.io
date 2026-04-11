import { Container } from '@/components/layout/Container';
import { ParticleField } from '@/components/ui/ParticleField';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-28 sm:px-10 lg:px-16 lg:pb-32 lg:pt-40">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(46,101,220,0.16),transparent_44%),radial-gradient(circle_at_88%_36%,rgba(46,101,220,0.14),transparent_44%),linear-gradient(180deg,#08090d_0%,#0a0b0f_100%)]" />
        <ParticleField />
      </div>

      <Container>
        <SectionReveal>
          <p className="research-kicker">Yfcccc Research System</p>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[1.06] text-text sm:text-6xl lg:text-7xl">
            A controlled website for structured learning, quant-style execution, and long-horizon iteration.
          </h1>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#progress"
              className="inline-flex items-center border border-line bg-black/20 px-6 py-2.5 text-sm text-[#dbe5f8] backdrop-blur-[1px] transition-colors duration-200 hover:border-accent hover:text-white"
            >
              View Progress
            </a>
            <span className="text-sm text-muted">Designed as an intentional system, not a decorative homepage.</span>
          </div>
        </SectionReveal>
      </Container>
    </section>
  );
}
