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
import type { Group, PointsHistory, TeamsSummaryJson } from '../common/types/index.js';
import { importDraftFile } from '../data/importDraftFile.js';
import { readJson } from './utils/readJson.js';
import { updateHistory } from './aggregate/updateHistory.js';
import { writeJson } from './utils/writeJson.js';
import { parseDate, today } from '../common/dates.js';
import { round2 } from './aggregate/getTotals.js';

const group: Group = 'men';
const year = 2024;
const { teams } = await importDraftFile(group, year);
const history: PointsHistory = {
  dates: [],
  teams: Object.fromEntries(teams.map((team) => [team.owner, []])),
};

// Read the previous summary files
// (summaryDate needs to be a real date, but the value doesn't matter)
const summaryDir = path.dirname(getSummaryFilePath({ group, year, summaryDate: today() }));
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
    history.teams[team.owner].push(round2(team.totalPoints));
  }
}

// Write the history file
const historyPath = getHistoryFilePath({ group, year });
writeJson(historyPath, history);

// Call the update method to fill in "movement"
// (will also rewrite the history file, but that's fine)
updateHistory({ group, teams: summary.teams, fileDate: parseDate(summaryDate) });

// Write the summary files
writeJson(summaryPath, summary);
writeJson(getSummaryFilePath({ group, year }), summary);
