import { SectionBlock } from '@/components/layout/SectionBlock';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { projects } from '@/data/projects';

export function ProjectShowcaseSection() {
  return (
    <SectionBlock id="projects" className="research-divider">
      <div className="mb-10">
        <SectionHeading
          title="Core Work"
          subtitle="Current systems under active quantitative iteration."
        />
      </div>

      <div className="border-t border-line">
        {projects.map((project) => (
          <article
            key={project.title}
            className="group grid gap-3 border-b border-line py-6 transition-colors duration-200 hover:bg-white/[0.02] md:grid-cols-[1.2fr_2fr] md:items-start"
          >
            <h3 className="text-xl font-semibold text-[#e8edf7] transition-colors duration-200 group-hover:text-white">{project.title}</h3>
            <p className="text-sm leading-7 text-muted transition-colors duration-200 group-hover:text-[#cdd6e7]">{project.description}</p>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
