import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';

export function AboutSection() {
  return (
    <SectionBlock id="about" className="research-divider" containerClassName="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeading title="About" />
        <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Independent builder focused on quantitative systems, interface clarity, and reproducible iteration.
        </p>
    </SectionBlock>
  );
}
