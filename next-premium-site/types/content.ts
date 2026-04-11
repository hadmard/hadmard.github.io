export type ProjectItem = {
  title: string;
  description: string;
  depth: number;
  lane: 'foundation' | 'research' | 'execution' | 'target';
  isGoal?: boolean;
};

export type VersionItem = {
  version: string;
  goal: string;
  changes: string;
  reasoning: string;
  nextStep: string;
};

export type MethodologyPillar = {
  title: string;
  text: string;
};

export type NavItem = {
  href: string;
  label: string;
};
