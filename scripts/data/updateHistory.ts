import fs from 'fs';
import { getDataFilePath } from '../../common/filenames.js';
import type { Group } from '../../common/types/Group.js';
import type { PointsHistory } from '../../common/types/PointsHistory.js';
import type { Team } from '../../common/types/Team.js';
import type { RankingMetadataResult } from './getRankingMetadata.js';
import { formatNumericDate } from '../../common/formatDate.js';

/**
 * Update points history file and fill in `movement` property of teams.
 */
export function updateHistory(
  params: Pick<RankingMetadataResult, 'fileDate'> & { group: Group; teams: Team[] },
): void {
  const { group, teams, fileDate } = params;

  const historyPath = getDataFilePath({ group, history: true, year: fileDate.getFullYear() });
  let history: PointsHistory;
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
  } else {
    history = {
      dates: [],
      teams: Object.fromEntries(teams.map((team) => [team.owner, []])),
    };
  }

  const newDateStr = formatNumericDate(fileDate);

  // Determine if we're overwriting the most recent entry
  let shouldOverwrite = false;
  if (history.dates.at(-1) === newDateStr) {
    shouldOverwrite = true;
  } else {
    // If not, add the new date
    history.dates.push(newDateStr);
  }

  // Add the new points
  for (const team of teams) {
    const teamHistory = history.teams[team.owner];
    if (shouldOverwrite) {
      teamHistory.pop(); // overwriting the most recent entry
    }
    teamHistory.push(team.totalPoints);
  }

  // Find the index of the date closest to a week ago
  // (use a verison of the date with time set to 0 for clean comparison)
  const weekAgo = new Date(newDateStr);
  weekAgo.setDate(weekAgo.getDate() - 7);
  let comparisonIndex = 0; // use first date if less than a week of data
  for (let i = history.dates.length - 1; i >= 0; i--) {
    const date = new Date(history.dates[i]);
    if (date <= weekAgo) {
      comparisonIndex = i;
      break;
    }
  }

  updateMovement({ teams, history, comparisonIndex });

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

/**
 * Determine the current and previous rankings and update the `movement` property of each team.
 */
export function updateMovement(params: {
  teams: Team[];
  history: PointsHistory;
  /** Previous ranking index to compare against */
  comparisonIndex: number;
}): void {
  const { teams, history, comparisonIndex } = params;

  // determine current ranking
  const currRanking = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  // determine previous ranking
  const prevRanking = teams
    .map(({ owner }) => ({ owner, totalPoints: history.teams[owner][comparisonIndex] }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  for (const team of teams) {
    const prevRank = prevRanking.findIndex((t) => t.owner === team.owner);
    const newRank = currRanking.findIndex((t) => t.owner === team.owner);
    team.movement = prevRank - newRank;
  }
}
