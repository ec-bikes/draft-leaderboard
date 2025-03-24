//
// Fill in missing history for a new team based on results data
//

import fs from 'fs';
import { getHistoryFilePath, getTeamDetailsFilePath } from '../common/filenames.js';
import type { Group, PointsHistory, TeamDetailsJson } from '../common/types/index.js';
import { readJson } from './utils/readJson.js';
import { writeJson } from './utils/writeJson.js';
import { getRiderTotal, getTeamTotal } from './aggregate/getTotals.js';
import { parseDate } from '../common/dates.js';

const owner = 'Discord Undrafted';
const group: Group = 'men';
const year = 2025;

const teamFile = getTeamDetailsFilePath({ group, year, owner });
if (!fs.existsSync(teamFile)) {
  console.error(`File for "${owner}" does not exist: ${teamFile}`);
  process.exit(1);
}

const teamDetails: TeamDetailsJson = readJson(teamFile);
const { riders } = teamDetails.team;

const historyFile = getHistoryFilePath({ group, year });
const history: PointsHistory = readJson(historyFile);

// Get the result totals as of each date (inefficient loops but small n)
const totals = history.dates.map((dateStr) => {
  const endDate = parseDate(dateStr);
  const riderTotals = riders.map((rider) => ({ totalPoints: getRiderTotal(rider, endDate) }));
  return getTeamTotal(riderTotals);
});

// Add the totals to the history
history.teams[owner] = totals;
writeJson(historyFile, history);
