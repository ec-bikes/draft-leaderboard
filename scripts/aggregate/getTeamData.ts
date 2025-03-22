import type {
  BaseTeam,
  Draft,
  RiderDetails,
  Source,
  TeamDetails,
  UciTeamsJson,
} from '../../common/types/index.js';
import { getRiderId } from '../../data/getRiderId.js';
import { getPcsRiderData } from '../pcs/getPcsRiderData.js';
import { getUciRiderData } from '../uci/index.js';
import { round2 } from '../utils/round2.js';

/**
 * Get data including results for each rider on a team (accounting for trades and sanctions)
 * and add the totals.
 */
export async function getTeamData(params: {
  source: Source;
  team: BaseTeam;
  momentId: number;
  draft: Pick<Draft, 'group' | 'year' | 'tradeDate'>;
  uciRiderInfo: UciTeamsJson['riderInfo'];
}): Promise<TeamDetails> {
  const { team: rawTeam, momentId, draft, source, uciRiderInfo } = params;
  const { year, group, tradeDate: tradeDateStr } = draft;
  const tradeDate = tradeDateStr ? new Date(tradeDateStr).getTime() : null;
  const { owner, name, riders, tradedOut } = rawTeam;
  const team: TeamDetails = {
    owner,
    name,
    totalPoints: 0,
    riders: [],
  };

  // do the requests one at a time for now
  for (const riderName of riders) {
    const riderId = getRiderId(riderName, group);
    if (!riderId) {
      throw new Error(`Couldn't find ID for ${riderName}`);
    }
    const uciRider = uciRiderInfo[riderId];
    if (!uciRider) {
      throw new Error(`Missing UciTeamsJson data for ${riderName} (${riderId})`);
    }

    // Currently it's necessary to fill in sanctions in UCI data from PCS data,
    // so get that regardless
    const riderParams = { rider: { name: riderName, id: riderId }, year };
    const pcsData = await getPcsRiderData(riderParams);

    const data =
      source === 'uci'
        ? await getUciRiderData({ ...riderParams, momentId, group, sanctions: pcsData.sanctions })
        : pcsData;

    const { results, ...riderData } = data;
    const rider: RiderDetails = {
      ...riderData,
      team: uciRider.team,
      country: uciRider.country,
      totalPoints: 0,
      results, // put this last
    };

    // Ensure the results are sorted by date descending
    rider.results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (rider.name === tradedOut) {
      rider.tradedOut = true;
    }
    if (rider.name === rawTeam.tradedIn) {
      rider.tradedIn = true;
    }

    // Trim results and update sanctions if the rider was traded
    // if (tradeDate && (rider.tradedIn || rider.tradedOut)) {
    if (tradeDate && rider.tradedOut) {
      // Find the first result before the trade date
      let tradeIndex = rider.results.findIndex((res) => new Date(res.date).getTime() < tradeDate);
      tradeIndex = tradeIndex === -1 ? Infinity : tradeIndex;

      rider.results = rider.results.slice(tradeIndex);
      // rider.results = rider.tradedIn
      //   ? rider.results.slice(0, tradeIndex)
      //   : rider.results.slice(tradeIndex);

      // Correct the sanctions to account for any before or after trade
      if (rider.sanctions && rider.sanctionsAtTrade) {
        rider.sanctions = rider.sanctionsAtTrade;
        // rider.sanctions = rider.tradedIn
        //   ? rider.sanctions - rider.sanctionsAtTrade
        //   : rider.sanctionsAtTrade;
      }
    }

    // Add the total from results, minus sanctions. Round it because it appears that in a TTT,
    // points are split evenly between riders, which can activate silly JS handling of floats.
    // (The rounding must happen last because silly float math also applies to subtraction!)
    rider.totalPoints = round2(
      rider.results.reduce((acc, res) => acc + res.points, 0) - (rider.sanctions || 0),
    );

    team.riders.push(rider);
    team.totalPoints += rider.totalPoints;
  }

  // Round this again in case of silly JS float math
  team.totalPoints = round2(team.totalPoints);

  return team;
}
