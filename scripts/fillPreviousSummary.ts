//
// Script to fill in a previous week's data from the current summary file.
// Limitation: won't include sanctions data since the only sources are undated.
//

import fs from 'fs';
import { getDataFilePath } from '../common/filenames.js';
import { groups } from '../common/constants.js';
import type { TeamDetailsJson, TeamsSummaryJson } from '../common/types/TeamJson.js';
import type { Rider } from '../common/types/Rider.js';
import type { Team } from '../common/types/Team.js';
import type { PointsHistory } from '../common/types/PointsHistory.js';
import { formatNumericDate } from '../common/formatDate.js';
import { updateMovement } from './data/updateHistory.js';

const year = 2025;
// This date should be a Tuesday, or the file will be removed by the cleanup script
const summaryDate = new Date('2025-02-25');

for (const group of groups) {
  const currentSummaryPath = getDataFilePath({ group, year, summary: true });
  const currentSummary: TeamsSummaryJson = JSON.parse(fs.readFileSync(currentSummaryPath, 'utf-8'));

  // Get team point totals at the given date based on previously saved results
  const teamData = currentSummary.teams.map<Team>((team) => {
    const teamDetailsPath = getDataFilePath({ group, year, owner: team.owner });
    const teamDetails: TeamDetailsJson = JSON.parse(fs.readFileSync(teamDetailsPath, 'utf-8'));

    // Get each rider's total points up to the summary date
    const riders = teamDetails.team.riders.map<Rider>(({ name, id, results }) => ({
      name,
      id,
      totalPoints: results.reduce(
        (total, result) => (new Date(result.date) < summaryDate ? total + result.points : total),
        0,
      ),
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
  const prevSummaryPath = getDataFilePath({ group, year, summaryDate });
  fs.writeFileSync(prevSummaryPath, JSON.stringify(summary, null, 2) + '\n');

  // Update history.
  // Assumes the new date should be the first in the history file.
  const historyPath = getDataFilePath({ group, history: true, year });
  const history: PointsHistory = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
  history.dates.unshift(formatNumericDate(summaryDate));
  for (const team of teamData) {
    history.teams[team.owner].unshift(team.totalPoints);
  }
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n');

  if (history.dates.length === 2) {
    // Update the current summary file's movement data
    updateMovement({ teams: currentSummary.teams, history, comparisonIndex: 0 });
    fs.writeFileSync(currentSummaryPath, JSON.stringify(currentSummary, null, 2) + '\n');
  }
}
