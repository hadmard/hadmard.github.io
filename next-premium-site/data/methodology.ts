import type { MethodologyPillar } from '@/types/content';

export const methodologyPillars: MethodologyPillar[] = [
  {
    title: '01 Frame',
    text: 'Define decision horizon, data trust boundary, and acceptable drawdown before implementation.',
  },
  {
    title: '02 Build',
    text: 'Implement only what is required, with explicit interfaces and known failure behavior.',
  },
  {
    title: '03 Verify',
    text: 'Validate with benchmark deltas, regime checks, and rollback conditions prior to release.',
  },
  {
    title: '04 Iterate',
    text: 'Record rationale, keep decisions auditable, and iterate through controlled release cadence.',
  },
];
