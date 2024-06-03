import type { Source } from '../../common/types/Source.js';
import type { BaseTeam, TeamDetails } from '../../common/types/Team.js';
import { getRiderUciData } from './getRiderUciData.js';
import { getRiderPcsData } from './getRiderPcsData.js';
import type { Draft } from '../../common/types/Draft.js';
import type { RiderDetails } from '../../common/types/Rider.js';

export async function getTeamData(params: {
  source: Source;
  team: BaseTeam;
  momentId: number;
  draft: Pick<Draft, 'group' | 'year' | 'tradeDate'>;
}): Promise<TeamDetails> {
  const { team: rawTeam, momentId, draft, source } = params;
  const { year, group, tradeDate: tradeDateStr } = draft;
  const tradeDate = tradeDateStr ? new Date(tradeDateStr).getTime() : null;
  const { owner, name, riders } = rawTeam;
  const team: TeamDetails = {
    owner,
    name,
    totalPoints: 0,
    riders: [],
  };

  // do the requests one at a time for now
  for (const rawRider of riders) {
    const riderData =
      source === 'uci'
        ? await getRiderUciData({ rider: rawRider, momentId, year, group })
        : await getRiderPcsData({ rider: rawRider, year });
    const rider: RiderDetails = { ...riderData, totalPoints: 0 };

    // Ensure the results are sorted by date descending
    rider.results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Trim results and update sanctions if the rider was traded
    if (tradeDate && (rider.tradedIn || rider.tradedOut)) {
      // Find the first result before the trade date
      let tradeIndex = rider.results.findIndex((res) => new Date(res.date).getTime() < tradeDate);
      tradeIndex = tradeIndex === -1 ? Infinity : tradeIndex;

      rider.results = rider.tradedIn
        ? rider.results.slice(0, tradeIndex)
        : rider.results.slice(tradeIndex);

      // Correct the sanctions to account for any before or after trade
      if (rider.sanctions && rider.sanctionsAtTrade) {
        rider.sanctions = rider.tradedIn
          ? rider.sanctions - rider.sanctionsAtTrade
          : rider.sanctionsAtTrade;
      }
    }

    // It appears that in a TTT, points are split evenly between riders, which can lead to
    // fractional points that JS might add in a silly way...
    rider.totalPoints = Math.round(rider.results.reduce((acc, res) => acc + res.points, 0));

    team.riders.push(rider);
    team.totalPoints += rider.totalPoints;
  }
  return team;
}
