import type { TeamsSummaryJson } from '../../types/Team.js';

export type Data = { women: TeamsSummaryJson; 'men-wt': TeamsSummaryJson };

export async function data(): Promise<Data> {
  // create a split point
  return {
    women: await import('../../data/teams-women.json'),
    'men-wt': await import('../../data/teams-men-wt.json'),
  };
}
