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

  // Find the index of the date closest to a week ago
  // (use a verison of the date with time set to 0 for clean comparison)
  const weekAgo = new Date(newDateStr);
  weekAgo.setDate(weekAgo.getDate() - 7);
  let comparisonIndex: number | undefined;
  for (let i = history.dates.length - 1; i >= 0; i--) {
    const date = new Date(history.dates[i]);
    if (date <= weekAgo) {
      comparisonIndex = i;
      break;
    }
  }

  let shouldOverwrite = false;
  if (history.dates.at(-1) === newDateStr) {
    shouldOverwrite = true;
  } else {
    history.dates.push(newDateStr);
  }

  // determine current ranking
  const currRanking = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);
  // determine previous ranking
  let prevRanking: Pick<Team, 'owner' | 'totalPoints'>[] | undefined;
  if (comparisonIndex !== undefined) {
    prevRanking = teams
      .map(({ owner }) => ({ owner, totalPoints: history.teams[owner][comparisonIndex] }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  for (const team of teams) {
    const teamHistory = history.teams[team.owner];
    shouldOverwrite && teamHistory.pop();
    teamHistory.push(team.totalPoints);

    if (prevRanking) {
      const prevRank = prevRanking.findIndex((t) => t.owner === team.owner);
      const newRank = currRanking.findIndex((t) => t.owner === team.owner);
      team.movement = prevRank - newRank;
    }
  }

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}
