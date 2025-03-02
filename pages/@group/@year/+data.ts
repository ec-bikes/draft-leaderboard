import type { PageContext } from 'vike/types';
import type { Group } from '../../../common/types/Group.js';
import type { CompetitionProps } from '../../../components/Competition/Competition.js';

// NOTE: Right now this just supports 2024

export async function data(pageContext: PageContext): Promise<CompetitionProps | undefined> {
  const group = pageContext.routeParams?.group as Group | undefined;
  if (!group) return undefined;

  const summary = await import(`../../../data/${group}2024/summary.json`);
  // Quirk of vite: it seems to require the original extension for variable dynamic imports
  const { draft } = await import(`../../../data/${group}sTeams2024.ts`);

  return {
    teamData: summary,
    ...draft,
  };
}
