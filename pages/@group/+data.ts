import type { PageContext } from 'vike/types';
import type { Group } from '../../common/types/Group.js';
import type { CompetitionProps } from '../../components/Competition/Competition.js';
import { draft as mensDraft } from '../../data/men/teams.js';
import { draft as womensDraft } from '../../data/women/teams.js';

export async function data(pageContext: PageContext): Promise<CompetitionProps | undefined> {
  const group = pageContext.routeParams?.group as Group | undefined;
  if (!group) return undefined;

  const summary = await import(`../../data/${group}/summary.json`);
  return {
    group,
    teamData: summary,
    ...(group === 'women' ? womensDraft : mensDraft),
  };
}
