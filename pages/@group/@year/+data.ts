import fs from 'fs';
import type { PageContext } from 'vike/types';
import type { ClientData } from '../../../common/types/ClientData.js';
import { years } from '../../../common/constants.js';
import { getSummaryFilePath, getUciTeamsFilePath } from '../../../common/filenames.js';
import type { Group } from '../../../common/types/Group.js';
import { readJson } from '../../../scripts/data/readJson.js';
import type { UciTeamsJson } from '../../../common/types/TeamJson.js';

export async function data(pageContext: PageContext): Promise<ClientData | undefined> {
  // This is also used for the top level route, so provide a default year
  const group = pageContext.routeParams.group as Group;
  const year = Number(pageContext.routeParams.year || years[0]);

  // If loading files without import() (which might be technically wrong if the server code was
  // ever exported to run somewhere else), it's necessary to use paths relative to cwd, since
  // absolute paths from repo root as calculated relative to import.meta.url would be messed up
  // when vike pre-renders the pages based on bundled server code.
  const uciTeamsPath = getUciTeamsFilePath({ group, year });
  let uciTeams: UciTeamsJson | undefined;
  if (fs.existsSync(uciTeamsPath)) {
    uciTeams = readJson(uciTeamsPath);
  }

  const importYear = year === years[0] ? '' : year;
  // Quirk of vite: it seems to require the original extension for variable dynamic imports
  const { draft } = await import(`../../../data/${group}sTeams${importYear}.ts`);

  return {
    teamData: readJson(getSummaryFilePath({ group, year })),
    uciTeamNames: uciTeams?.teamNames,
    draft,
  };
}
