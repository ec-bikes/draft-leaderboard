import fs from 'fs';
import { getHistoryFilePath } from '../../common/filenames.js';
import { formatDate, parseDate, type SafeDate } from '../../common/dates.js';
import type { Group, PointsHistory, Team } from '../../common/types/index.js';
import { readJson } from '../utils/readJson.js';
import { writeJson } from '../utils/writeJson.js';

/**
 * Update points history file and fill in `movement` property of teams.
 */
export function updateHistory(params: { fileDate: SafeDate; group: Group; teams: Team[] }): void {
  const { group, teams, fileDate } = params;

  const historyPath = getHistoryFilePath({ group, year: fileDate.year() });
  let history: PointsHistory;
  if (fs.existsSync(historyPath)) {
    history = readJson(historyPath);
  } else {
    history = {
      dates: [],
      teams: Object.fromEntries(teams.map((team) => [team.owner, []])),
    };
  }

  const newDateStr = formatDate(fileDate, 'isoDate');

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
  const weekAgo = parseDate(newDateStr).subtract(7, 'days');
  let comparisonIndex = 0; // use first date if less than a week of data
  for (let i = history.dates.length - 1; i >= 0; i--) {
    const date = parseDate(history.dates[i]);
    if (date.isBefore(weekAgo, true)) {
      comparisonIndex = i;
      break;
    }
  }

  updateMovement({ teams, history, comparisonIndex });

  writeJson(historyPath, history);
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
