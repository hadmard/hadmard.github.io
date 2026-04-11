import { SectionReveal } from '@/components/ui/SectionReveal';

const pillars = [
  {
    title: '01 Frame',
    text: 'Define constraints first: decision horizon, data trust boundary, and acceptable risk envelope.',
  },
  {
    title: '02 Build',
    text: 'Implement minimal viable architecture with explicit ownership of interfaces and failure paths.',
  },
  {
    title: '03 Verify',
    text: 'Use versioned checks, benchmark deltas, and rollback logic before declaring readiness.',
  },
  {
    title: '04 Iterate',
    text: 'Capture rationale, keep decisions auditable, and evolve with disciplined release cadence.',
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <SectionReveal className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Methodology</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted">
            System thinking is treated as an execution contract. Every release has a purpose, an explicit trade-off, and a measurable outcome.
          </p>
        </div>
        <div className="space-y-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl bg-surface/85 p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#CCD4E2]">{pillar.text}</p>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
