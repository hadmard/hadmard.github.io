import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { projects } from '@/data/projects';

const depthLabels: Record<number, string> = {
  1: 'Depth 01 / Foundation',
  2: 'Depth 02 / Research',
  3: 'Depth 03 / Execution',
  4: 'Depth 04 / Target',
};

const laneLabels: Record<string, string> = {
  foundation: '基础并列',
  research: '研究并列',
  execution: '执行并列',
  target: '目标收敛',
};

export function ProjectShowcaseSection() {
  const depths = Array.from(new Set(projects.map((item) => item.depth))).sort((a, b) => a - b);

  return (
    <SectionBlock id="progress" className="research-divider">
      <div className="mb-10">
        <SectionHeading
          title="Progress"
          subtitle="Knowledge depth progresses from left to right. Parallel items share a column; progression moves across columns."
        />
      </div>

      <div className="overflow-x-auto border-t border-line pb-2">
        <div className="min-w-[980px] px-1 pt-8">
          <div className="grid grid-cols-4 gap-8">
            {depths.map((depth, depthIndex) => {
              const items = projects.filter((item) => item.depth === depth);

              return (
                <section key={depth} className="relative">
                  {depthIndex < depths.length - 1 ? (
                    <div className="pointer-events-none absolute right-[-18px] top-6 hidden text-[#5e6a80] lg:block">→</div>
                  ) : null}

                  <header className="mb-4">
                    <p className="research-kicker text-accent">{depthLabels[depth] ?? `Depth ${depth}`}</p>
                  </header>

                  <div className="space-y-4">
                    {items.map((project) => (
                      <article
                        key={project.title}
                        className={[
                          'border border-line p-4 transition-colors duration-200 hover:bg-white/[0.02]',
                          project.isGoal ? 'border-accent/50' : '',
                        ].join(' ')}
                      >
                        <p className="research-kicker text-[#9aa6bc]">{laneLabels[project.lane]}</p>
                        <h3 className="mt-2 text-base font-semibold text-[#e7ecf6]">{project.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted">{project.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}
