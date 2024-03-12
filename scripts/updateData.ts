import fs from 'fs';
import { rawTeamsWomen } from './data/rawTeamsWomen.js';
import { getTeamData } from './data/getTeamData.js';
import type { Team, TeamDetailsJson, TeamsSummaryJson } from '../src/types/Team.js';
import { getRankingMetadata } from './data/getRankingMetadata.js';
import type { Group } from '../src/types/Rider.js';
import type { RawTeam } from './types/RawTeam.js';
import { rawTeamsMen } from './data/rawTeamsMen.js';

const year = 2024;
const groups: Record<Group, RawTeam[]> = {
  // women: rawTeamsWomen,
  'men-wt': rawTeamsMen,
};

(async () => {
  const metadata = await getRankingMetadata();
  if (typeof metadata === 'string') {
    console.error('❌', metadata);
    process.exit(1);
  }

  for (const [group, rawTeams] of Object.entries(groups) as [Group, RawTeam[]][]) {
    // Get data for each team
    const teams: Team[] = [];
    for (const rawTeam of rawTeams) {
      console.log(`==== ${rawTeam.owner} ====`);
      const team = await getTeamData({ team: rawTeam, momentId: metadata.momentId, year, group });

      // Update the detailed team data file (only the current version, not dated)
      writeFiles<TeamDetailsJson>({
        name: `team-${group}-${team.owner.split(' ')[0].toLowerCase()}`,
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
      name: 'teams-' + group,
      data: { ...metadata, teams },
      dated: true, // also write a dated version of this file
    });
  }
})().catch((err) => {
  console.error((err as Error).stack || err);
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
