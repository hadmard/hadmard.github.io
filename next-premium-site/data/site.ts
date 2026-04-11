export type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  metric: string;
  detail: string;
};

export type VersionItem = {
  version: string;
  goal: string;
  changes: string;
  reasoning: string;
  nextStep: string;
};

export const projects: ProjectItem[] = [
  {
    title: 'Signal Execution Studio',
    description: 'A low-latency research-to-execution workflow for systematic idea deployment.',
    tags: ['TypeScript', 'Data Infra', 'Execution'],
    metric: 'P95 query latency -38%',
    detail: 'Unified experiment definitions with deterministic snapshots and one-click production export.',
  },
  {
    title: 'Portfolio Intelligence Engine',
    description: 'Decision layer for allocation, risk budgeting, and scenario response.',
    tags: ['Risk', 'Optimization', 'Analytics'],
    metric: 'Drawdown volatility -21%',
    detail: 'Replaced ad-hoc spreadsheets with governed portfolio state transitions and policy checks.',
  },
  {
    title: 'Research OS',
    description: 'A structured environment connecting data lineage, notebooks, and release notes.',
    tags: ['Platform', 'Workflow', 'Governance'],
    metric: 'Release cycle 12d -> 5d',
    detail: 'Built a version-first workflow so every shipped model has traceable assumptions and rationale.',
  },
  {
    title: 'Learning Graph Interface',
    description: 'Content-first map interface for staged technical progression and execution plans.',
    tags: ['UI Architecture', 'DX', 'Learning'],
    metric: 'Task completion +33%',
    detail: 'Converted dense graph relationships into sectioned paths and project-level synthesis.',
  },
];

export const versionHistory: VersionItem[] = [
  {
    version: 'v1.0.0',
    goal: 'Establish a premium minimal baseline.',
    changes: 'Created a strict visual system with high contrast, spacing cadence, and content hierarchy.',
    reasoning: 'A stable baseline avoids style drift and supports long-term scalability.',
    nextStep: 'Add project intelligence with richer cards and clear metadata.',
  },
  {
    version: 'v1.1.0',
    goal: 'Refine project narrative quality.',
    changes: 'Introduced outcome-oriented card content: problem, method, measurable effect.',
    reasoning: 'Impact communication is stronger when outcomes are explicit and contextual.',
    nextStep: 'Introduce methodology section to explain systematic workflow.',
  },
  {
    version: 'v1.2.0',
    goal: 'Strengthen execution transparency.',
    changes: 'Added methodology and version timeline with goal, changes, reasoning, next step.',
    reasoning: 'A clear process narrative builds trust beyond visual polish.',
    nextStep: 'Tune motion system for subtle and precise interactions only.',
  },
];
