import type { PageContext } from 'vike/types';
import type { CompetitionProps } from '../../components/Competition/Competition.js';
import { draft as mensDraft } from '../../data/mensTeams.js';
import { draft as womensDraft } from '../../data/womensTeams.js';

export async function data(pageContext: PageContext): Promise<CompetitionProps | undefined> {
  const { group } = pageContext.routeParams;

  const summary = await import(`../../data/${group}/summary.json`);
  return {
    teamData: summary,
    ...(group === 'women' ? womensDraft : mensDraft),
  };
}
