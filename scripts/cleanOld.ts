import fs from 'fs';
import path from 'path';

// Clean the files to keep one for every week

const fileRegex = /^summary-(\d{4}-\d{2}-\d{2})\.json$/;

for (const group of ['men', 'women']) {
  const dir = `data/${group}/previous`;
  let startDate: Date | undefined;
  const contents = fs.readdirSync(dir).sort();
  const lastFile = contents.at(-1)!;
  for (const file of contents) {
    if (file === lastFile) continue;
    const fileDateStr = file.match(fileRegex)?.[1];
    if (!fileDateStr) continue;
    const fileDate = new Date(fileDateStr);
    if (startDate) {
      if (fileDate < startDate) {
        fs.rmSync(path.join(dir, file));
      } else {
        startDate.setDate(startDate.getDate() + 7);
      }
    } else {
      startDate = fileDate;
      startDate.setDate(startDate.getDate() + 7);
    }
  }
}
