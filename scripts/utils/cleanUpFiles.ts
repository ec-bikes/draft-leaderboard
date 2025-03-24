import fs from 'fs';
import path from 'path';
import { datedSummaryFileRegex, getSummaryFilePath } from '../../common/filenames.js';
import type { Group } from '../../common/types/index.js';
import { parseDate, today } from '../../common/dates.js';

// Keep the files from Tuesdays to match the UCI update date and the end of the weekend's racing
const tuesday = 2;

/**
 * For PCS, we end up with a file every day, which is excessive to keep them all.
 * Delete files more than a month old, except one for each week.
 */
export function cleanUpFiles(group: Group, year: number) {
  const monthAgo = today().subtract(1, 'month');

  const previousDir = path.dirname(getSummaryFilePath({ group, year, summaryDate: monthAgo }));
  const previousFiles = fs.readdirSync(previousDir).sort();
  for (const file of previousFiles) {
    const fileDateStr = file.match(datedSummaryFileRegex)?.[1];
    const fileDate = fileDateStr && parseDate(fileDateStr);
    if (fileDate && fileDate.isBefore(monthAgo) && fileDate.day() !== tuesday) {
      fs.rmSync(path.join(previousDir, file));
    }
  }
}
