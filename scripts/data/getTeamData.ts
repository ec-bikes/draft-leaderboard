import type { Group } from '../../common/types/Group.js';
import type { BaseTeam, TeamDetails } from '../../common/types/Team.js';
import { getRiderData } from './getRiderData.js';

export async function getTeamData(params: {
  team: BaseTeam;
  momentId: number;
  year: number;
  group: Group;
}): Promise<TeamDetails> {
  const { team: rawTeam, momentId, year, group } = params;
  const { owner, name, riders } = rawTeam;
  const team: TeamDetails = {
    owner,
    name,
    totalPoints: 0,
    riders: [],
  };

  // do the requests one at a time for now
  for (const rawRider of riders) {
    const rider = await getRiderData({ rider: rawRider, momentId, year, group });
    team.riders.push(rider);
    team.totalPoints += rider.totalPoints || 0;
  }
  return team;
}
