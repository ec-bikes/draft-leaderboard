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
import { getPcsRiderData } from './pcs/getPcsRiderData.js';
import { readJson } from './utils/readJson.js';
import { writeJson } from './utils/writeJson.js';
import { getUciRiderList, type UciRiderRanking } from './uci/index.js';

const group: Group = process.argv.includes('--men') ? 'men' : 'women';
const year = years[0];
const { teams } = await importDraftFile(group, year);

// Either read data/{group}-{year}/riders.json or fetch it from the UCI API
const processUci = process.argv.includes('--uci');
const forceUciFetch = process.argv.includes('--force');
// Fetch PCS data for each rider who's listed on a team
const fetchPcs = process.argv.includes('--pcs');

/**
 * Get a map from normalized **lowercase** rider names to object IDs.
 * This will fetch from the UCI API if riders.json doesn't exist or --force is used.
 *
 * Also logs the the mapping with attempted proper case names to the console,
 * and writes the raw results to riders.json.
 */
async function getUciRiderIds() {
  const ridersFile = getRidersFilePath({ group, year });

  let prevRiders: UciRiderRanking[] | undefined;
  if (!forceUciFetch && fs.existsSync(ridersFile)) {
    prevRiders = readJson(ridersFile);
  }

  const result = await getUciRiderList({ group, rawRiders: prevRiders });
  if (typeof result === 'string') {
    console.error('❌', result);
    process.exit(1);
  }
  writeJson(ridersFile, result.rawRiders);

  // Log the names in attempted proper case (better for manually populating [group]sRiders.ts)
  const properCaseResult = Object.fromEntries(result.riders.map((r) => [r.name, r.id]));
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
        await getPcsRiderData({ rider, year: 2025 });
      } catch (err) {
        console.error('❌', (err as Error).message);
      }
    }
  }
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
