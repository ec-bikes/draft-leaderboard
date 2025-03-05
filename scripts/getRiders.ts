//
// Script to get UCI rider object IDs and figure out if any need custom PCS URLs.
// (The names and IDs are manually copied into data/___Riders.ts.)
//

import fs from 'fs';
import { years } from '../common/constants.js';
import { getRidersFilePath } from '../common/filenames.js';
import type { BaseRider, Group } from '../common/types/index.js';
import { getRiderId } from '../data/getRiderId.js';
import { importDraftFile } from '../data/importDraftFile.js';
import { getRiderPcsData } from './data/getRiderPcsData.js';
import { readJson } from './data/readJson.js';
import { toTitleCase } from './data/toTitleCase.js';
import { getUciRiderRankings } from './data/uci/getUciRiderRankings.js';
import type { UciRiderRanking } from './data/uci/types/UciRiderRanking.js';
import { writeJson } from './data/writeJson.js';

const group: Group = process.argv.includes('--men') ? 'men' : 'women';
const year = years[0];
const { teams } = await importDraftFile(group, year);

// Either read data/{group}-{year}/riders.json or fetch it from the UCI API
const processUci = process.argv.includes('--uci');
const forceUciFetch = process.argv.includes('--force');
// Fetch PCS data for each rider who's listed on a team
const fetchPcs = process.argv.includes('--pcs');

// Fetch this many riders from the UCI ranking
const fetchUciRankingCount = 300;

/**
 * Fetch the top `fetchUciRankingCount` riders from the UCI ranking and return a map from
 * normalized **lowercase** names (they come in format LAST First) to object IDs.
 *
 * Also logs the the mapping with attempted proper case names to the console.
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
  const properCaseResult = Object.fromEntries(
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
      const lastName = toTitleCase(name.slice(0, firstNameIndex));
      return [`${firstName} ${lastName}`.trim(), id];
    }),
  );

  // Log the names in attempted proper case (better for manually populating [group]sRiders.ts)
  console.log(JSON.stringify(properCaseResult, null, 2));

  // Return the names in lowercase for more reliable lookup
  return Object.fromEntries(
    Object.entries(properCaseResult).map(([name, id]) => [name.toLowerCase(), id]),
  );
}

(async () => {
  const calcRiderIds = processUci ? await getUciRiderIds() : undefined;

  const fetchRiders: BaseRider[] = [];
  for (const team of teams) {
    for (const name of team.riders) {
      const id = calcRiderIds?.[name.toLowerCase()] || getRiderId(name, group);
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
