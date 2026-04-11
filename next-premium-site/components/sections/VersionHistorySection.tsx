import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { versionHistory } from '@/data/versionHistory';

export function VersionHistorySection() {
  return (
    <SectionBlock id="history" className="research-divider">
      <SectionHeading
        title="Iteration Log"
        subtitle="Versioned updates recorded as research changelog entries."
      />

      <div className="mt-12 space-y-8 border-t border-line pt-2">
        {versionHistory.map((item, index) => (
          <div key={item.version} className="grid gap-4 lg:grid-cols-[140px_1fr]">
            <div className="relative pt-1">
              <div className="research-kicker text-accent">{item.version}</div>
              {index < versionHistory.length - 1 ? (
                <div className="absolute left-1 top-7 h-[calc(100%+28px)] w-px bg-line" />
              ) : null}
            </div>
            <div className="pb-2">
              <dl className="grid gap-4 text-sm leading-7 text-[#d3dbea] sm:grid-cols-2">
                <div>
                  <dt className="research-kicker">Goal</dt>
                  <dd className="mt-1">{item.goal}</dd>
                </div>
                <div>
                  <dt className="research-kicker">Changes</dt>
                  <dd className="mt-1">{item.changes}</dd>
                </div>
                <div>
                  <dt className="research-kicker">Reasoning</dt>
                  <dd className="mt-1">{item.reasoning}</dd>
                </div>
                <div>
                  <dt className="research-kicker">Next</dt>
                  <dd className="mt-1">{item.nextStep}</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}
