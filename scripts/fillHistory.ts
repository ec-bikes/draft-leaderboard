//
// Script to fill in history data for 2024
//

import fs from 'fs';
import path from 'path';
import { datedSummaryFileRegex, getDataFilePath } from '../common/filenames.js';
import type { Group } from '../common/types/Group.js';
import type { PointsHistory } from '../common/types/PointsHistory.js';
import { teams as womensTeams } from '../data/womensTeams2024.js';
import { teams as mensTeams } from '../data/mensTeams2024.js';
import { updateHistory } from './data/updateHistory.js';
import type { TeamsSummaryJson } from '../common/types/TeamJson.js';

const group: Group = 'men';
const teams = group === 'men' ? mensTeams : womensTeams;
const year = 2024;
const history: PointsHistory = {
  dates: [],
  teams: Object.fromEntries(teams.map((team) => [team.owner, []])),
};

// Read the previous summary files
const summaryDir = path.dirname(getDataFilePath({ group, year, summaryDate: new Date() }));
const previousFiles = fs
  .readdirSync(summaryDir)
  .sort()
  .filter((f) => datedSummaryFileRegex.test(f));

let summary = {} as TeamsSummaryJson;
let summaryPath = '';
let summaryDate = '';
for (const file of previousFiles) {
  summaryPath = path.join(summaryDir, file);
  summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  // add the date
  summaryDate = file.match(datedSummaryFileRegex)![1];
  history.dates.push(summaryDate);
  // add the points
  for (const team of summary.teams) {
    history.teams[team.owner].push(team.totalPoints);
  }
}

// Write the history file
const historyPath = getDataFilePath({ group, history: true, year });
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n');

// Call the update method to fill in "movement"
// (will also rewrite the history file, but that's fine)
updateHistory({ group, teams: summary.teams, fileDate: new Date(summaryDate) });

// Write the summary files
const summaryText = JSON.stringify(summary, null, 2) + '\n';
fs.writeFileSync(summaryPath, summaryText);
fs.writeFileSync(getDataFilePath({ group, year, summary: true }), summaryText);
