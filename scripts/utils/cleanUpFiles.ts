import fs from 'fs';
import path from 'path';
import { datedSummaryFileRegex, getSummaryFilePath } from '../../common/filenames.js';
import type { Group } from '../../common/types/index.js';
import { utcDateFromString } from '../../common/formatDate.js';

/**
 * For PCS, we end up with a file every day, which is excessive to keep them all.
 * Delete files more than a month old, except one for each week.
 */
export function cleanUpFiles(group: Group, year: number) {
  // Keep the files from Tuesdays to match the UCI update date and the end of the weekend's racing
  const tuesday = 2;
  const monthAgo = new Date();
  monthAgo.setUTCMonth(monthAgo.getUTCMonth() - 1);

  const previousDir = path.dirname(getSummaryFilePath({ group, year, summaryDate: monthAgo }));
  const previousFiles = fs.readdirSync(previousDir).sort();
  for (const file of previousFiles) {
    const fileDateStr = file.match(datedSummaryFileRegex)?.[1];
    const fileDate = fileDateStr && utcDateFromString(fileDateStr);
    if (fileDate && fileDate < monthAgo && fileDate.getUTCDay() !== tuesday) {
      fs.rmSync(path.join(previousDir, file));
    }
  }
}
