import fs from 'fs';
import path from 'path';
import { datedSummaryFileRegex, getSummaryFilePath } from '../../common/filenames.js';
import type { Group } from '../../common/types/Group.js';

/**
 * For PCS, we end up with a file every day, which is excessive to keep them all.
 * Delete files more than a month old, except one for each week.
 */
export function cleanUpFiles(group: Group, year: number) {
  // Keep the files from Tuesdays to match the UCI update date and the end of the weekend's racing
  const tuesday = 2;
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const previousDir = path.dirname(getSummaryFilePath({ group, year, summaryDate: monthAgo }));
  const previousFiles = fs.readdirSync(previousDir).sort();
  for (const file of previousFiles) {
    const fileDateStr = file.match(datedSummaryFileRegex)?.[1];
    const fileDate = fileDateStr && new Date(fileDateStr);
    if (fileDate && fileDate < monthAgo && fileDate.getDay() !== tuesday) {
      fs.rmSync(path.join(previousDir, file));
    }
  }
}
