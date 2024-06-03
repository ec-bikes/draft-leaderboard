import type { PageContext } from 'vike/types';
import type { Group } from '../../common/types/Group.js';
import type { CompetitionProps } from '../../components/Competition/Competition.js';
import * as mensTeams from '../../data/men/teams.js';
import * as womensTeams from '../../data/women/teams.js';

export type Data = Omit<CompetitionProps, 'group'>;

export async function data(pageContext: PageContext): Promise<Data | undefined> {
  const group = pageContext.routeParams?.group as Group | undefined;
  if (!group) return undefined;

  const summary = await import(`../../data/${group}/summary.json`);
  return {
    teamData: summary,
    podcast: group === 'women' ? womensTeams.podcast : mensTeams.podcast,
    link: group === 'women' ? womensTeams.link : mensTeams.link,
  };
}
