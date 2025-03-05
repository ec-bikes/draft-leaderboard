import type { Source } from '../common/types/Source.js';
import type { Team } from '../common/types/Team.js';
import type { TeamDetailsJson, TeamsSummaryJson } from '../common/types/TeamJson.js';
import * as men from '../data/mensTeams.js';
import * as women from '../data/womensTeams.js';
import { getMensRiderId } from '../data/mensRiders.js';
import { getWomensRiderId } from '../data/womensRiders.js';
import { getRankingMetadata } from './data/getRankingMetadata.js';
import { getTeamData } from './data/getTeamData.js';
import { logError } from './log.js';
import {
  getSummaryFilePath,
  getTeamDetailsFilePath,
  getUciTeamsFilePath,
} from '../common/filenames.js';
import { cleanUpFiles } from './data/cleanUpFiles.js';
import { updateHistory } from './data/updateHistory.js';
import { writeJson } from './data/writeJson.js';
import { readJson } from './data/readJson.js';

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
    const getRiderId = group === 'men' ? getMensRiderId : getWomensRiderId;

    const uciTeamsJson = readJson(getUciTeamsFilePath({ group, year }));

    // Get the momentId value (which is slightly different between men and women) and ranking date.
    // The momentId needs to be saved even if we're not using UCI data to be able to make accurate
    // UCI URLs linking to rider results.
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
        getRiderId,
        uciRiderInfo: uciTeamsJson.riderInfo,
      });

      // Update the detailed team data file (only the current version, not dated)
      const teamDetails: TeamDetailsJson = { ...metadata, team };
      writeJson(getTeamDetailsFilePath({ group, year, owner: team.owner }), teamDetails);

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
    writeJson(getSummaryFilePath({ group, year }), teamsSummary);
    writeJson(getSummaryFilePath({ group, year, summaryDate: fileDate }), teamsSummary);

    if (source === 'pcs') {
      cleanUpFiles(group, year);
    }
  }
})().catch((err) => {
  logError((err as Error).stack || err);
  process.exit(1);
});
