import fs from 'fs';
import { getTeamFilename } from '../common/getTeamFilename.js';
import type { Group } from '../common/types/Group.js';
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
import path from 'path';

const drafts = [women, men];

const groupArg = process.argv.includes('--men')
  ? 'men'
  : process.argv.includes('--women')
    ? 'women'
    : undefined;
const source: Source = 'pcs';

(async () => {
  for (const draftMod of drafts) {
    const { draft, teams: rawTeams } = draftMod;
    const { group } = draft;
    if (groupArg && groupArg !== group) {
      continue; // skip other groups if a specific one was requested
    }
    const riderIds = group === 'men' ? mensRiders : womensRiders;

    // Get the momentId value (which is slightly different between men and women) and ranking date
    const metadata = await getRankingMetadata({ group, source });
    if (typeof metadata === 'string') {
      logError(metadata);
      process.exit(1);
    }

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
      writeFiles<TeamDetailsJson>({
        name: `details/${getTeamFilename(team.owner)}`,
        group,
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
      name: 'summary',
      group,
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
  group: Group;
  data: TData & { rankingDateShort: string };
  /** If true, write an extra dated file */
  dated?: boolean;
}) {
  const {
    name,
    dated,
    group,
    data: { rankingDateShort, ...data },
  } = params;
  const str = JSON.stringify(data, null, 2) + '\n';

  const groupFile = `data/${group}/${name}.json`;
  fs.mkdirSync(path.dirname(groupFile), { recursive: true });
  fs.writeFileSync(groupFile, str);

  if (dated) {
    const groupPrevFile = `data/${group}/previous/${name}-${rankingDateShort}.json`;
    fs.mkdirSync(path.dirname(groupPrevFile), { recursive: true });
    fs.writeFileSync(groupPrevFile, str);
  }
}
