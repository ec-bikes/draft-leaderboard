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
import { formatDate, parseDate } from '../common/dates.js';
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
import { getRiderTotal, getTeamTotal } from './aggregate/getTotals.js';

const year = 2025;
// This date should be a Tuesday, or the file will be removed by the cleanup script
const dateArg = process.argv[2];
if (!dateArg) {
  console.error('Please provide a date in YYYY-MM-DD format as an argument.');
  process.exit(1);
}
const summaryDate = parseDate(dateArg);

for (const group of groups) {
  const currentSummaryPath = getSummaryFilePath({ group, year });
  const currentSummary: TeamsSummaryJson = readJson(currentSummaryPath);

  // Get team point totals at the given date based on previously saved results
  const teamData = currentSummary.teams.map<Team>((team) => {
    const teamDetailsPath = getTeamDetailsFilePath({ group, year, owner: team.owner });
    const teamDetails: TeamDetailsJson = readJson(teamDetailsPath);

    // Get each rider's total points up to the summary date
    const riders = teamDetails.team.riders.map<Rider>((rider) => ({
      name: rider.name,
      id: rider.id,
      totalPoints: getRiderTotal(rider, summaryDate),
    }));

    return {
      owner: team.owner,
      name: team.name,
      totalPoints: getTeamTotal(riders),
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
  const formattedDate = formatDate(summaryDate, 'isoDate');
  const dateIndex = history.dates.findIndex((d) => d.localeCompare(formattedDate) > 0);
  history.dates.splice(dateIndex, 0, formattedDate);
  for (const team of teamData) {
    history.teams[team.owner].splice(dateIndex, 0, team.totalPoints);
  }
  writeJson(historyPath, history);

  if (history.dates.length === 2) {
    // Update the current summary file's movement data
    updateMovement({ teams: currentSummary.teams, history, comparisonIndex: 0 });
    writeJson(currentSummaryPath, currentSummary);
  }
}
