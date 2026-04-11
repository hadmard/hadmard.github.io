import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';

const projectGoals = [
  {
    title: 'Internship Goal: Google / Meta / Jane Street',
    description: 'Target a high-standard internship by demonstrating quant-grade system thinking and execution ownership.',
  },
  {
    title: 'Project A: Research-to-Execution Pipeline',
    description: 'Deliver an end-to-end pipeline from hypothesis formulation to monitored deployment.',
  },
  {
    title: 'Project B: Risk-Aware Allocation Engine',
    description: 'Build a decision layer that converts model signals into constrained capital allocation.',
  },
];

export function ProjectsSection() {
  return (
    <SectionBlock id="projects" className="research-divider">
      <SectionHeading title="Projects" subtitle="Execution targets mapped to measurable outcomes." />

      <div className="mt-10 border-t border-line">
        {projectGoals.map((goal) => (
          <article key={goal.title} className="group grid gap-3 border-b border-line py-6 transition-colors duration-200 hover:bg-white/[0.02] md:grid-cols-[1.2fr_2fr] md:items-start">
            <h3 className="text-lg font-semibold text-[#e8edf7] transition-colors duration-200 group-hover:text-white">{goal.title}</h3>
            <p className="text-sm leading-7 text-muted transition-colors duration-200 group-hover:text-[#cdd6e7]">{goal.description}</p>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
