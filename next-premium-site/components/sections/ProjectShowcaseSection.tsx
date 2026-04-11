import { projects } from '@/data/site';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function ProjectShowcaseSection() {
  return (
    <section id="projects" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <SectionReveal className="mx-auto w-full max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Project Showcase</h2>
            <p className="mt-4 max-w-2xl text-muted">
              Structured execution records with concise problem framing, implementation direction, and measurable effect.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group rounded-3xl bg-surface p-7 shadow-soft transition-all duration-200 hover:scale-[1.02] hover:shadow-focus"
            >
              <h3 className="text-2xl font-semibold text-text">{project.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#CDD4E1]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 text-sm font-medium text-[#DDE6FF]">{project.metric}</div>
              <p className="mt-3 max-h-0 overflow-hidden text-sm leading-7 text-[#BCC6D6] opacity-0 transition-all duration-250 group-hover:max-h-20 group-hover:opacity-100">
                {project.detail}
              </p>
            </article>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
