import type { PageContext } from 'vike/types';
import type { ClientData } from '../../common/types/ClientData.js';
import { draft as mensDraft } from '../../data/mensTeams.js';
import { draft as womensDraft } from '../../data/womensTeams.js';

export async function data(pageContext: PageContext): Promise<ClientData | undefined> {
  const { group } = pageContext.routeParams;

  const summary = await import(`../../data/${group}/summary.json`);
  return {
    teamData: summary,
    draft: group === 'women' ? womensDraft : mensDraft,
  };
}
