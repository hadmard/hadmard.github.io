import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { methodologyPillars } from '@/data/methodology';

export function MethodologySection() {
  return (
    <SectionBlock id="methodology" className="research-divider" containerClassName="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <SectionHeading title="Methodology" />
        <p className="mt-6 max-w-xl text-base leading-8 text-muted">
          Structured as a research note: assumptions first, implementation second, verification always explicit.
        </p>
      </div>
      <div className="border-t border-line">
        {methodologyPillars.map((pillar) => (
          <div key={pillar.title} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[130px_1fr] sm:items-start">
            <h3 className="research-kicker text-[#aab4c7]">{pillar.title}</h3>
            <p className="text-sm leading-7 text-[#c8d1e2]">{pillar.text}</p>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}
