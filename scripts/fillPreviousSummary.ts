//
// Script to fill in a previous week's data from the current summary file.
// Limitation: won't include sanctions data since the only sources are undated.
//

import { groups } from '../common/constants.js';
import {
  getHistoryFilePath,
  getSummaryFilePath,
  getTeamDetailsFilePath,
} from '../common/filenames.js';
import { formatNumericDate } from '../common/formatDate.js';
import type {
  PointsHistory,
  Rider,
  Team,
  TeamDetailsJson,
  TeamsSummaryJson,
} from '../common/types/index.js';
import { readJson } from './utils/readJson.js';
import { updateMovement } from './aggregate/updateHistory.js';
import { writeJson } from './utils/writeJson.js';

const year = 2025;
// This date should be a Tuesday, or the file will be removed by the cleanup script
const summaryDate = new Date('2025-02-25');

for (const group of groups) {
  const currentSummaryPath = getSummaryFilePath({ group, year });
  const currentSummary: TeamsSummaryJson = readJson(currentSummaryPath);

  // Get team point totals at the given date based on previously saved results
  const teamData = currentSummary.teams.map<Team>((team) => {
    const teamDetailsPath = getTeamDetailsFilePath({ group, year, owner: team.owner });
    const teamDetails: TeamDetailsJson = readJson(teamDetailsPath);

    // Get each rider's total points up to the summary date
    const riders = teamDetails.team.riders.map<Rider>(({ name, id, results, sanctions = 0 }) => ({
      name,
      id,
      totalPoints:
        results.reduce(
          (total, result) => (new Date(result.date) < summaryDate ? total + result.points : total),
          0,
        ) - sanctions,
    }));

    return {
      owner: team.owner,
      name: team.name,
      totalPoints: Math.round(riders.reduce((total, rider) => total + rider.totalPoints, 0)),
      riders,
    };
  });

  // Write the previous summary file
  const summary: TeamsSummaryJson = {
    // keep the old momentId, which may be wrong but doesn't matter
    ...currentSummary,
    teams: teamData,
  };
  const prevSummaryPath = getSummaryFilePath({ group, year, summaryDate });
  writeJson(prevSummaryPath, summary);

  // Update history.
  // Assumes the new date should be the first in the history file.
  const historyPath = getHistoryFilePath({ group, year });
  const history: PointsHistory = readJson(historyPath);
  history.dates.unshift(formatNumericDate(summaryDate));
  for (const team of teamData) {
    history.teams[team.owner].unshift(team.totalPoints);
  }
  writeJson(historyPath, history);

  if (history.dates.length === 2) {
    // Update the current summary file's movement data
    updateMovement({ teams: currentSummary.teams, history, comparisonIndex: 0 });
    writeJson(currentSummaryPath, currentSummary);
  }
}
