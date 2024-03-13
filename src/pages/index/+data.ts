import type { TeamsSummaryJson } from '../../types/Team.js';

export type Data = { women: TeamsSummaryJson; men: TeamsSummaryJson };

export async function data(): Promise<Data> {
  // create a split point
  return {
    women: (await import('../../data/women/summary.json')) as TeamsSummaryJson,
    men: (await import('../../data/men/summary.json')) as TeamsSummaryJson,
  };
}
