import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';

export function ThinkingSection() {
  return (
    <SectionBlock id="thinking" className="research-divider">
      <SectionHeading title="Thinking" subtitle="Personal thinking stream and structured notes." />

      <div className="mt-10 border-t border-line">
        <article className="border-b border-line py-6">
          <p className="research-kicker text-[#9aa6bc]">Test</p>
          <h3 className="mt-2 text-lg font-semibold text-[#e7ecf6]">test</h3>
          <p className="mt-2 text-sm leading-7 text-muted">Placeholder entry for the upcoming thinking module implementation.</p>
        </article>
      </div>
    </SectionBlock>
  );
}
