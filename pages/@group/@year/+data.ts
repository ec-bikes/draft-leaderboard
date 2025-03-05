import fs from 'fs';
import type { PageContext } from 'vike/types';
import type { DraftData } from '../../../common/types/DraftData.js';
import { years } from '../../../common/constants.js';
import { getSummaryFilePath, getUciTeamsFilePath } from '../../../common/filenames.js';
import type { Group } from '../../../common/types/Group.js';
import { readJson } from '../../../scripts/data/readJson.js';
import type { TeamsSummaryJson, UciTeamsJson } from '../../../common/types/TeamJson.js';
import { importDraftFile } from '../../../data/importDraftFile.js';

export async function data(pageContext: PageContext): Promise<DraftData | undefined> {
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

  const { teams: _, ...draft } = await importDraftFile(group, year);

  const teamsJson: TeamsSummaryJson = readJson(getSummaryFilePath({ group, year }));

  return {
    ...teamsJson,
    ...draft,
    uciTeamNames: uciTeams?.teamNames,
  };
}
