import type { ProjectItem } from '@/types/content';

export const projects: ProjectItem[] = [
  {
    title: 'Probability + Optimization Core',
    description: 'Build mathematical rigor for modeling assumptions and decision boundaries.',
    depth: 1,
    lane: 'foundation',
  },
  {
    title: 'Systems Programming Discipline',
    description: 'Strengthen low-level engineering habits for performance-sensitive workloads.',
    depth: 1,
    lane: 'foundation',
  },
  {
    title: 'Signal Research Framework',
    description: 'Formalize feature discovery, validation protocol, and reproducible experiment loops.',
    depth: 2,
    lane: 'research',
  },
  {
    title: 'Portfolio Intelligence Layer',
    description: 'Translate model outputs into constrained allocation and risk-budget decisions.',
    depth: 2,
    lane: 'research',
  },
  {
    title: 'Execution Infrastructure',
    description: 'Connect research decisions to robust execution with monitoring and rollback controls.',
    depth: 3,
    lane: 'execution',
  },
  {
    title: 'Research Operating System',
    description: 'Keep assumptions, changes, and outcomes fully traceable across releases.',
    depth: 3,
    lane: 'execution',
  },
  {
    title: 'Internship Target: Google / Meta / Jane Street',
    description: 'Convert quantified capability into internship-level impact at top global technology firms.',
    depth: 4,
    lane: 'target',
    isGoal: true,
  },
];
