import fs from 'fs';
import type { UciRiderRanking } from './data/uci/types/UciRiderRanking.js';
import { getRiderPcsData } from './data/getRiderPcsData.js';
import { getUciRiderRankings } from './data/uci/getUciRiderRankings.js';
import { teams } from '../data/men/teams.js';

// Initial script to try and get rider IDs and figure out if any need custom PCS URLs
(async () => {
  const ridersFile = 'riders.json';
  let riders: UciRiderRanking[];
  if (fs.existsSync(ridersFile)) {
    riders = JSON.parse(fs.readFileSync(ridersFile, 'utf8'));
  } else {
    const result = await getUciRiderRankings({ limit: 400, group: 'men' });
    if (typeof result === 'string') {
      console.error('❌', result);
      process.exit(1);
    }
    fs.writeFileSync(ridersFile, JSON.stringify(result, null, 2));
    riders = result;
  }

  const riderIds = Object.fromEntries(
    riders.map((rider) => {
      const id = rider.ObjectId;
      const name = rider.IndividualFullName;
      const firstNameIndex = name.match(/(?<= )[A-Z][a-zé]/)?.index;
      if (!firstNameIndex) {
        console.log(`couldn't process ${name} ${id}`);
        return [name, id];
      }
      const firstName = name.slice(firstNameIndex);
      const lastName = name
        .slice(0, firstNameIndex)
        .replace(/\b\S+\b/g, (val) => val[0] + val.slice(1).toLowerCase());
      console.log(firstName, lastName, id);
      return [`${firstName} ${lastName}`.trim(), id];
    }),
  );

  for (const team of teams) {
    for (const rider of team.riders) {
      const id = riderIds[rider.name];
      if (id) {
        rider.id = id;
      } else {
        console.log(`couldn't find ${rider.name}`);
      }
    }
  }
  console.log(JSON.stringify(teams));

  for (const team of teams) {
    for (const rider of team.riders) {
      console.log(rider.name);
      await getRiderPcsData({ rider, year: 2024 });
    }
  }
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
