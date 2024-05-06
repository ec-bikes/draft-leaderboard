import type { Group } from '../../common/types/Group.js';
import type { Source } from '../../common/types/Source.js';
import type { BaseTeam, TeamDetails } from '../../common/types/Team.js';
import { getRiderUciData } from './getRiderUciData.js';
import { getRiderPcsData } from './getRiderPcsData.js';

export async function getTeamData(params: {
  source: Source;
  team: BaseTeam;
  momentId: number;
  year: number;
  group: Group;
}): Promise<TeamDetails> {
  const { team: rawTeam, momentId, year, group, source } = params;
  const { owner, name, riders } = rawTeam;
  const team: TeamDetails = {
    owner,
    name,
    totalPoints: 0,
    riders: [],
  };

  // do the requests one at a time for now
  for (const rawRider of riders) {
    const rider =
      source === 'uci'
        ? await getRiderUciData({ rider: rawRider, momentId, year, group })
        : await getRiderPcsData({ rider: rawRider, year });
    team.riders.push(rider);
    team.totalPoints += rider.totalPoints || 0;
  }
  return team;
}
