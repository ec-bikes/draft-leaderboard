import { formatDate, type SafeDate } from './dates.js';
import type { Group } from './types/Group.js';

/** Matches a dated summary file basename. Group 1 is the date YYYY-MM-DD. */
export const datedSummaryFileRegex = /^summary-(\d{4}-\d{2}-\d{2})\.json$/;

interface FileParams {
  group: Group;
  year: number;
}

function getBasePath({ group, year }: FileParams) {
  return `data/${group}-${year}` as const;
}

/** Get the path to a summary data file. */
export function getSummaryFilePath(
  params: FileParams & {
    /** If provided, returns a dated summary file path under `/previous/`. */
    summaryDate?: SafeDate;
  },
) {
  const { summaryDate } = params;
  const base = getBasePath(params);
  return summaryDate
    ? // Should match datedSummaryFileRegex
      (`${base}/previous/summary-${formatDate(summaryDate, 'isoDate')}.json` as const)
    : (`${base}/summary.json` as const);
}

/** Get a team details data file path. */
export function getTeamDetailsFilePath(params: FileParams & { owner: string }) {
  const base = getBasePath(params);
  return `${base}/details/${params.owner.split(' ')[0].toLowerCase()}.json` as const;
}

/** Get a history data file path. */
export function getHistoryFilePath(params: FileParams) {
  return `${getBasePath(params)}/history.json` as const;
}

/** Get a UCI teams data file path. */
export function getUciTeamsFilePath(params: FileParams) {
  return `${getBasePath(params)}/uciTeams.json` as const;
}

/** Get a UCI rider list data file path. */
export function getRidersFilePath(params: FileParams) {
  return `${getBasePath(params)}/riders.json` as const;
}
