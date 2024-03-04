import fs from 'fs';
import { rawTeams } from './data/rawTeams';
import { getTeamData } from './data/getTeamData';
import type { Team } from '../src/types/Team';

// TODO figure out how this updates...
const momentId = 175727;

(async () => {
  const allTeams: Team[] = [];
  for (const team of rawTeams) {
    console.log(`==== ${team.owner} ====`);
    // one at a time
    const teamData = await getTeamData({ team, momentId });
    allTeams.push(teamData);
    console.log();
    // fs.writeFileSync(`team${team.owner}.json`, JSON.stringify(teamData, null, 2));
  }
  const date = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(`src/data/teams-${date}.json`, JSON.stringify(allTeams, null, 2));
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
// // Turns out it's this simple because Node isn't restrictive about CORS like browsers are...
// const result2 = await fetch('https://dataride.uci.ch/iframe/IndividualEventRankings/', {
//   method: 'POST',
//   headers: {
//     'content-type': 'application/x-www-form-urlencoded',
//   },
//   body: 'individualId=151466&rankingId=32&momentId=175727&groupId=2&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0&take=40&skip=0&page=1&pageSize=40',
// });
// const text = await result2.text();
// console.log(text);
