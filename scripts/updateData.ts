import fs from 'fs';
import { rawTeams } from './data/rawTeams';
import { getTeamData } from './data/getTeamData';
import type { Team } from '../src/types/Team';
import { searchUciRiderRankings } from './data/uciApis';

(async () => {
  // Search for a rider to get the current momentId parameter value, since it's unclear how this is
  // calculated and the race results API will return the wrong data if it's not updated...
  const sampleName = 'Demi Vollering';
  const sampleSearch = await searchUciRiderRankings(sampleName);
  if (typeof sampleSearch === 'string') {
    console.error('❌ Error getting momentId from rider search result:', sampleSearch);
    return;
  }
  if (sampleSearch.length === 0) {
    console.error(`❌ No search results for "${sampleName}"`);
    return;
  }
  const momentId = sampleSearch[0].MomentId;

  const allTeams: Team[] = [];
  for (const team of rawTeams) {
    console.log(`==== ${team.owner} ====`);
    // one at a time
    const teamData = await getTeamData({ team, momentId });
    allTeams.push(teamData);
    console.log();
    // fs.writeFileSync(`team${team.owner}.json`, JSON.stringify(teamData, null, 2));
  }

  // Write both a dated file and the main file
  const stringData = JSON.stringify(allTeams, null, 2) + '\n';
  const date = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(`src/data/teams-${date}.json`, stringData);
  fs.writeFileSync('src/data/teams.json', stringData);
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
