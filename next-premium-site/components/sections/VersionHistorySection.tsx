import { versionHistory } from '@/data/site';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function VersionHistorySection() {
  return (
    <section id="history" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <SectionReveal className="mx-auto w-full max-w-6xl">
        <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Version History</h2>
        <p className="mt-4 max-w-2xl text-muted">
          A concise timeline describing each release intent, what changed, why it changed, and what comes next.
        </p>

        <div className="mt-12 space-y-10">
          {versionHistory.map((item, index) => (
            <div key={item.version} className="grid gap-4 lg:grid-cols-[180px_1fr]">
              <div className="relative">
                <div className="font-mono text-sm tracking-[0.14em] text-accent">{item.version}</div>
                {index < versionHistory.length - 1 ? (
                  <div className="absolute left-1.5 top-8 h-[calc(100%+34px)] w-px bg-white/10" />
                ) : null}
              </div>
              <div className="rounded-2xl bg-surface p-6 sm:p-7">
                <dl className="grid gap-4 text-sm leading-7 text-[#D8DFEA] sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Goal</dt>
                    <dd className="mt-1">{item.goal}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Changes</dt>
                    <dd className="mt-1">{item.changes}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Reasoning</dt>
                    <dd className="mt-1">{item.reasoning}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Next Step</dt>
                    <dd className="mt-1">{item.nextStep}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
