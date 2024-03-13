import fs from 'fs';
import { rawTeamsWomen } from './data/rawTeamsWomen.js';
import { getTeamData } from './data/getTeamData.js';
import type { Team, TeamDetailsJson, TeamsSummaryJson } from '../src/types/Team.js';
import { getRankingMetadata } from './data/getRankingMetadata.js';
import type { Group } from '../src/types/Rider.js';
import type { RawTeam } from './types/RawTeam.js';
import { rawTeamsMen } from './data/rawTeamsMen.js';
import { logError } from './log.js';
import { getTeamFilename } from '../src/data/getTeamFilename.js';

const year = 2024;
const groups: Record<Group, RawTeam[]> = {
  women: rawTeamsWomen,
  men: rawTeamsMen,
};

const groupArg = process.argv[2] as Group | undefined;

(async () => {
  for (const [group, rawTeams] of Object.entries(groups) as [Group, RawTeam[]][]) {
    if (groupArg && groupArg !== group) {
      continue; // skip other groups if a specific one was requested
    }

    // Get the momentId value (which is slightly different between men and women) and ranking date
    const metadata = await getRankingMetadata(group);
    if (typeof metadata === 'string') {
      logError(metadata);
      process.exit(1);
    }

    // Get data for each team
    const teams: Team[] = [];
    for (const rawTeam of rawTeams) {
      console.log(`==== ${rawTeam.owner} ====`);
      const team = await getTeamData({ team: rawTeam, momentId: metadata.momentId, year, group });

      // Update the detailed team data file (only the current version, not dated)
      writeFiles<TeamDetailsJson>({
        name: `${group}/details/${getTeamFilename(team.owner)}`,
        data: { ...metadata, team },
      });

      teams.push({
        ...team,
        // remove the results
        riders: team.riders.map(({ results, ...rest }) => rest),
      });
      console.log();
    }

    // Write the summary file
    writeFiles<TeamsSummaryJson>({
      name: `${group}/summary`,
      data: { ...metadata, teams },
      dated: true, // also write a dated version of this file
    });
  }
})().catch((err) => {
  logError((err as Error).stack || err);
  process.exit(1);
});

function writeFiles<TData>(params: {
  name: string;
  data: TData & { rankingDateShort: string };
  /** If true, write an extra dated file */
  dated?: boolean;
}) {
  const {
    name,
    dated,
    data: { rankingDateShort, ...data },
  } = params;
  const str = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(`src/data/${name}.json`, str);
  dated && fs.writeFileSync(`src/data/${name}-${rankingDateShort}.json`, str);
}
