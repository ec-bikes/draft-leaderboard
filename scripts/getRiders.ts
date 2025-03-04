//
// Script to get UCI rider object IDs and figure out if any need custom PCS URLs.
// (The names and IDs are manually copied into data/___Riders.ts.)
//

import fs from 'fs';
import type { UciRiderRanking } from './data/uci/types/UciRiderRanking.js';
import { getRiderPcsData } from './data/getRiderPcsData.js';
import { getUciRiderRankings } from './data/uci/getUciRiderRankings.js';
import { teams as mensTeams } from '../data/mensTeams.js';
import { teams as womensTeams } from '../data/womensTeams.js';
import type { Group } from '../common/types/Group.js';
import type { BaseRider } from '../common/types/Rider.js';
import { mensRiders } from '../data/mensRiders.js';
import { womensRiders } from '../data/womensRiders.js';
import { writeJson } from './data/writeJson.js';
import { getRidersFilePath } from '../common/filenames.js';
import { years } from '../common/constants.js';
import { readJson } from './data/readJson.js';

const group: Group = process.argv.includes('--men') ? 'men' : 'women';
const savedRiders = group === 'men' ? mensRiders : womensRiders;
const teams = group === 'men' ? mensTeams : womensTeams;
const year = years[0];

// Either read data/{group}/riders.json or fetch it from the UCI API
const processUci = process.argv.includes('--uci');
const forceUciFetch = process.argv.includes('--force');
// Fetch PCS data for each rider who's listed on a team
const fetchPcs = process.argv.includes('--pcs');

// Fetch this many riders from the UCI ranking
const fetchUciRankingCount = 300;

/**
 * Fetch the top `fetchUciRankingCount` riders from the UCI ranking and return a map from
 * normalized names (they come in format LAST First) to object IDs.
 */
async function getUciRiderIds() {
  const ridersFile = getRidersFilePath({ group, year });
  let riders: UciRiderRanking[];
  if (fs.existsSync(ridersFile) && !forceUciFetch) {
    riders = readJson(ridersFile);
  } else {
    const result = await getUciRiderRankings({ limit: fetchUciRankingCount, group });
    if (typeof result === 'string') {
      console.error('❌', result);
      process.exit(1);
    }
    writeJson(ridersFile, result);
    riders = result;
  }

  // Try to convert the names from "LAST First" to "First Last".
  // This gets interesting with multiple names and non-ASCII characters.
  const result = Object.fromEntries(
    riders.map((rider) => {
      const { DisplayName: name, ObjectId: id } = rider;

      // To find the first name, look for the first uppercase letter followed by lowercase.
      // This doesn't work if the second letter is non-ASCII...so include a few known ones,
      // but log a message if it doesn't work.
      const firstNameIndex = name.match(/(?<= )[A-Z][a-zéøá]/)?.index;
      if (!firstNameIndex) {
        console.log(`❗️ Couldn't find first/last name for ${name} ${id}`);
        return [name, id];
      }

      // First names with a non-ASCII last letter incorrectly have it stored as uppercase
      const firstName = name.slice(firstNameIndex).replace(/.$/, (val) => val.toLowerCase());

      // Imperfect attempt to capitalize words in the last name...
      const lastName = name
        .slice(0, firstNameIndex)
        .replace(/\b\S+\b/g, (val) => val[0] + val.slice(1).toLowerCase())
        .replace(/ (De|Der|Den|Van) /i, (val) => val.toLowerCase());
      return [`${firstName} ${lastName}`.trim(), id];
    }),
  );

  console.log(JSON.stringify(result, null, 2));
  return result;
}

(async () => {
  const calcRiderIds = processUci ? await getUciRiderIds() : undefined;

  const fetchRiders: BaseRider[] = [];
  for (const team of teams) {
    for (const name of team.riders) {
      const id = savedRiders[name] || calcRiderIds?.[name];
      if (id) {
        fetchRiders.push({ name, id });
      } else {
        console.log(`❌ Rider "${name}" from team list not found in saved rider IDs or CI data`);
      }
    }
  }

  if (fetchPcs) {
    for (const rider of fetchRiders) {
      try {
        await getRiderPcsData({ rider, year: 2025 });
      } catch (err) {
        console.error('❌', (err as Error).message);
      }
    }
  }
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
