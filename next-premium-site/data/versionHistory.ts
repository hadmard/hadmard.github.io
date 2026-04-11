import type { VersionItem } from '@/types/content';

export const versionHistory: VersionItem[] = [
  {
    version: 'v1.0.0',
    goal: 'Define a controlled baseline interface.',
    changes: 'Established typographic hierarchy, spacing rhythm, and restrained color policy.',
    reasoning: 'A stable baseline is required for reliable long-term iteration.',
    nextStep: 'Reduce visual motifs and strengthen information structure.',
  },
  {
    version: 'v1.1.0',
    goal: 'Refactor project layer toward concise records.',
    changes: 'Compressed each project into title and single-line description with strict wording.',
    reasoning: 'Concise records are easier to compare across cycles and regimes.',
    nextStep: 'Standardize methodology as a repeatable protocol.',
  },
  {
    version: 'v1.2.0',
    goal: 'Convert release narrative into research log format.',
    changes: 'Normalized entries into goal, changes, reasoning, and next step fields.',
    reasoning: 'Structured logs preserve rationale under iteration pressure.',
    nextStep: 'Keep motion minimal and focus on informational dominance.',
  },
];
