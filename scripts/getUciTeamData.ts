//
// Get real team info about each rider included in the draft and write to uciTeams.json.
//
import fs from 'fs';
import { groups, years } from '../common/constants.js';
import { getRidersFilePath, getUciTeamsFilePath } from '../common/filenames.js';
import type { UciTeamsJson } from '../common/types/index.js';
import { getRiderId } from '../data/getRiderId.js';
import { importDraftFile } from '../data/importDraftFile.js';
import { readJson } from './utils/readJson.js';
import { toTitleCase } from './utils/toTitleCase.js';
import type { UciRiderRanking } from './data/uci/types/UciRiderRanking.js';
import { writeJson } from './utils/writeJson.js';

const year = years[0];
const files = {
  men: getUciTeamsFilePath({ group: 'men', year }),
  women: getUciTeamsFilePath({ group: 'women', year }),
};
const missing = { men: [] as string[], women: [] as string[] };

for (const group of groups) {
  const { teams } = await importDraftFile(group, year);

  const ridersPath = getRidersFilePath({ group, year });
  if (!fs.existsSync(ridersPath)) {
    throw new Error('Run getRiders first');
  }
  const uciRiders: UciRiderRanking[] = readJson(ridersPath);

  const teamsJson: UciTeamsJson = {
    teamNames: {},
    riderInfo: {},
  };

  for (const team of teams) {
    for (const riderName of team.riders) {
      const riderId = getRiderId(riderName, group);
      if (!riderId) {
        throw new Error(`Couldn't find ID for ${riderName}`);
      }

      const nameAndId = `${riderName} (${riderId})`;
      const rider = uciRiders.find((r) => r.ObjectId === riderId);
      if (!rider) {
        console.warn(`Couldn't find ${nameAndId} in UCI rankings`);
        missing[group].push(nameAndId);
        continue;
      }

      const { TeamCode, TeamName, FlagCode } = rider;
      if (!(TeamCode && TeamName && FlagCode)) {
        console.warn(`Missing data for ${nameAndId} (see ${ridersPath})`);
        missing[group].push(nameAndId);
      } else {
        teamsJson.teamNames[TeamCode] = toTitleCase(TeamName);
        teamsJson.riderInfo[riderId] = {
          name: riderName,
          team: TeamCode,
          country: FlagCode,
        };
      }
    }
  }

  writeJson(files[group], teamsJson);
  console.log(`\nWrote ${files[group]} (manually check the casing of team names...)\n`);
}

for (const group of groups) {
  if (missing[group].length) {
    console.error(`Manually add data in ${files[group]} for the following riders:`);
    console.error(missing[group].map((rider) => `- ${rider}\n`).join(''));
    process.exitCode = 1;
  }
}
