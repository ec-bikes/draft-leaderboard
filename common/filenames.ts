import { formatNumericDate } from './formatDate.js';
import type { Group } from './types/Group.js';

/** Matches a dated summary file basename. Group 1 is the date YYYY-MM-DD. */
export const datedSummaryFileRegex = /^summary-(\d{4}-\d{2}-\d{2})\.json$/;

/**
 * Get a filename for a team data file or summary file.
 * Provide exactly ONE of `summary`, `summaryDate`, or `owner`.
 *
 * (Unfortunately this can't be used for dynamic imports of data files,
 * but it at least serves as a central reference.)
 */
export function getDataFilePath(params: {
  group: Group;
  /** Write the current summary file */
  summary?: boolean;
  /** Write a dated summary file under `/previous/` */
  summaryDate?: Date;
  /** Write the team details file */
  owner?: string;
}): string {
  const { group, summary, owner, summaryDate } = params;

  const root = `data/${group}`;
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
  throw new Error('Must provide exactly one of summary, summaryDate, or owner');
}
