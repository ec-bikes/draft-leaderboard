import type { PageContext } from 'vike/types';
import type { CompetitionProps } from '../../../components/Competition/Competition.js';
import { years } from '../../../common/constants.js';

export async function data(pageContext: PageContext): Promise<CompetitionProps | undefined> {
  const { group, year } = pageContext.routeParams;

  const importYear = Number(year) === years[0] ? '' : year;
  const summary = await import(`../../../data/${group}${importYear}/summary.json`);
  // Quirk of vite: it seems to require the original extension for variable dynamic imports
  const { draft } = await import(`../../../data/${group}sTeams${importYear}.ts`);

  return {
    teamData: summary,
    ...draft,
  };
}
