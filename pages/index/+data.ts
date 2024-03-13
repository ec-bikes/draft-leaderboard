import type { TeamsSummaryJson } from '../../common/types/Team.js';

export type Data = {
  women: TeamsSummaryJson;
  men: TeamsSummaryJson;
};

export async function data(): Promise<Data> {
  return {
    women: (await import('../../data/women/summary.json')) as TeamsSummaryJson,
    men: (await import('../../data/men/summary.json')) as TeamsSummaryJson,
  };
}
