import type { TeamDetails } from '../../src/types/Team';
import type { RawTeam } from '../types/RawTeam';
import { getRiderData } from './getRiderData';

export async function getTeamData(params: {
  team: RawTeam;
  momentId: number;
  year: number;
}): Promise<TeamDetails> {
  const { team: rawTeam, momentId, year } = params;
  const { owner, name, riders } = rawTeam;
  const team: TeamDetails = {
    owner,
    name,
    totalPoints: 0,
    issues: [],
    riders: [],
  };

  // do the requests one at a time for now
  for (const rawRider of riders) {
    const { rider, issues } = await getRiderData({ rider: rawRider, momentId, year });
    team.riders.push(rider);
    team.totalPoints += rider.totalPoints || 0;
    if (issues.length) {
      team.issues.push(`${rider.name}: ${issues.join('; ')}`);
    }
  }
  return team;
}
