export type ProjectItem = {
  title: string;
  description: string;
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
