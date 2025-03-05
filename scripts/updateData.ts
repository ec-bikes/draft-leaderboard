import { years } from '../common/constants.js';
import {
  getSummaryFilePath,
  getTeamDetailsFilePath,
  getUciTeamsFilePath,
} from '../common/filenames.js';
import type { Source, Team, TeamDetailsJson, TeamsSummaryJson } from '../common/types/index.js';
import { importDraftFile } from '../data/importDraftFile.js';
import { cleanUpFiles } from './data/cleanUpFiles.js';
import { getRankingMetadata } from './data/getRankingMetadata.js';
import { getTeamData } from './data/getTeamData.js';
import { readJson } from './utils/readJson.js';
import { updateHistory } from './data/updateHistory.js';
import { writeJson } from './utils/writeJson.js';
import { logError } from './log.js';

const year = years[0];
const drafts = {
  women: await importDraftFile('women', year),
  men: await importDraftFile('men', year),
};

const groupArg = process.argv.includes('--men')
  ? 'men'
  : process.argv.includes('--women')
    ? 'women'
    : undefined;
const source: Source = 'pcs';

(async () => {
  for (const { teams: rawTeams, ...draft } of Object.values(drafts)) {
    const { group } = draft;
    if (groupArg && groupArg !== group) {
      continue; // skip other groups if a specific one was requested
    }

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
