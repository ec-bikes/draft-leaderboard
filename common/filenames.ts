import { formatNumericDate } from './formatDate.js';
import type { Group } from './types/Group.js';

/** Matches a dated summary file basename. Group 1 is the date YYYY-MM-DD. */
export const datedSummaryFileRegex = /^summary-(\d{4}-\d{2}-\d{2})\.json$/;

/**
 * Get the path for a data file.
 * Provide exactly ONE of the optional props to determine the file type.
 *
 * (Unfortunately this can't be used for dynamic imports of data files,
 * but it at least serves as a central reference.)
 */
export function getDataFilePath(params: {
  group: Group;
  year: number;
  /** Main summary file */
  summary?: boolean;
  /** Dated summary file under `/previous/` */
  summaryDate?: Date;
  /** Team details file */
  owner?: string;
  /** Points history file */
  history?: boolean;
}): string {
  const { group, year, summary, owner, summaryDate } = params;

  let root = `data/${group}`;
  if (year !== new Date().getFullYear()) {
    root += `${year}`;
  }
  if (summary) {
    return `${root}/summary.json`;
  }
  if (summaryDate) {
    // Should match datedSummaryFileRegex
    return `${root}/previous/summary-${formatNumericDate(summaryDate)}.json`;
  }
  if (owner) {
    return `${root}/details/${owner.split(' ')[0].toLowerCase()}.json`;
  }
  throw new Error('Missing type of file');
}
