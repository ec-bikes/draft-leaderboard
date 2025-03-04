//
// Script to fill in history data for 2024
//

import fs from 'fs';
import path from 'path';
import {
  datedSummaryFileRegex,
  getHistoryFilePath,
  getSummaryFilePath,
} from '../common/filenames.js';
import type { Group } from '../common/types/Group.js';
import type { PointsHistory } from '../common/types/PointsHistory.js';
import { teams as womensTeams } from '../data/womensTeams2024.js';
import { teams as mensTeams } from '../data/mensTeams2024.js';
import { updateHistory } from './data/updateHistory.js';
import type { TeamsSummaryJson } from '../common/types/TeamJson.js';
import { writeJson } from './data/writeJson.js';
import { readJson } from './data/readJson.js';

const group: Group = 'men';
const teams = group === 'men' ? mensTeams : womensTeams;
const year = 2024;
const history: PointsHistory = {
  dates: [],
  teams: Object.fromEntries(teams.map((team) => [team.owner, []])),
};

// Read the previous summary files
const summaryDir = path.dirname(getSummaryFilePath({ group, year, summaryDate: new Date() }));
const previousFiles = fs
  .readdirSync(summaryDir)
  .sort()
  .filter((f) => datedSummaryFileRegex.test(f));

let summary = {} as TeamsSummaryJson;
let summaryPath = '';
let summaryDate = '';
for (const file of previousFiles) {
  summaryPath = path.join(summaryDir, file);
  summary = readJson(summaryPath);
  // add the date
  summaryDate = file.match(datedSummaryFileRegex)![1];
  history.dates.push(summaryDate);
  // add the points
  for (const team of summary.teams) {
    history.teams[team.owner].push(team.totalPoints);
  }
}

// Write the history file
const historyPath = getHistoryFilePath({ group, year });
writeJson(historyPath, history);

// Call the update method to fill in "movement"
// (will also rewrite the history file, but that's fine)
updateHistory({ group, teams: summary.teams, fileDate: new Date(summaryDate) });

// Write the summary files
writeJson(summaryPath, summary);
writeJson(getSummaryFilePath({ group, year }), summary);
