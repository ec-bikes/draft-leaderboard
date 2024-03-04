import type { Team } from '../../src/types/Team';
import type { RawTeam } from '../types/RawTeam';
import { getRiderData } from './getRiderData';

export async function getTeamData(params: { team: RawTeam; momentId: number }): Promise<Team> {
  const { team: rawTeam, momentId } = params;
  const { owner, name, riders } = rawTeam;
  const team: Team = {
    owner,
    name,
    totalPoints: 0,
    issues: [],
    riders: [],
  };

  // do the requests one at a time for now
  for (const rawRider of riders) {
    const { rider, issues } = await getRiderData({ rider: rawRider, momentId });
    team.riders.push(rider);
    team.totalPoints += rider.totalPoints || 0;
    if (issues.length) {
      team.issues.push(`${rider.name}: ${issues.join('; ')}`);
    }
  }
  return team;
}
