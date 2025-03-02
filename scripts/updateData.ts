import fs from 'fs';
import path from 'path';
import type { Source } from '../common/types/Source.js';
import type { Team } from '../common/types/Team.js';
import type { TeamDetailsJson, TeamsSummaryJson } from '../common/types/TeamJson.js';
import * as men from '../data/mensTeams.js';
import * as women from '../data/womensTeams.js';
import { mensRiders } from '../data/mensRiders.js';
import { womensRiders } from '../data/womensRiders.js';
import { getRankingMetadata } from './data/getRankingMetadata.js';
import { getTeamData } from './data/getTeamData.js';
import { logError } from './log.js';
import { getDataFilePath } from '../common/filenames.js';
import { cleanUpFiles } from './data/cleanUpFiles.js';
import { updateHistory } from './data/updateHistory.js';

const drafts = [women, men];
const year = women.draft.year;

const groupArg = process.argv.includes('--men')
  ? 'men'
  : process.argv.includes('--women')
    ? 'women'
    : undefined;
const source: Source = 'pcs';

(async () => {
  for (const { draft, teams: rawTeams } of drafts) {
    const { group } = draft;
    if (groupArg && groupArg !== group) {
      continue; // skip other groups if a specific one was requested
    }
    const riderIds = group === 'men' ? mensRiders : womensRiders;

    // Get the momentId value (which is slightly different between men and women) and ranking date
    const metadataResult = await getRankingMetadata({ group, source });
    if (typeof metadataResult === 'string') {
      logError(metadataResult);
      process.exit(1);
    }
    const { metadata, fileDate } = metadataResult;

    // Get data for each team
    const teams: Team[] = [];
    for (const rawTeam of rawTeams) {
      console.log(`==== ${rawTeam.owner} ====`);
      const team = await getTeamData({
        team: rawTeam,
        momentId: metadata.momentId,
        draft,
        source,
        riderIds,
      });

      // Update the detailed team data file (only the current version, not dated)
      const teamDetails: TeamDetailsJson = { ...metadata, team };
      writeFile(getDataFilePath({ group, year, owner: team.owner }), teamDetails);

      teams.push({
        ...team,
        // remove the results
        riders: team.riders.map(({ results, ...rest }) => rest),
      });
      console.log();
    }

    // Update history and fill in `movement` property of teams
    updateHistory({ group, teams, fileDate });

    // Write the summary file and a dated version
    const teamsSummary: TeamsSummaryJson = { ...metadata, teams };
    writeFile(getDataFilePath({ group, year, summary: true }), teamsSummary);
    writeFile(getDataFilePath({ group, year, summaryDate: fileDate }), teamsSummary);

    if (source === 'pcs') {
      cleanUpFiles(group, year);
    }
  }
})().catch((err) => {
  logError((err as Error).stack || err);
  process.exit(1);
});

/** Write the data to the file, ensuring the directory exists first. */
function writeFile(filePath: string, data: object) {
  const str = JSON.stringify(data, null, 2) + '\n';

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, str);
}
