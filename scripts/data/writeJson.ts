import fs from 'fs';
import path from 'path';

/** Write the data to the file, ensuring the directory exists first. */
export function writeJson(filePath: string, data: object) {
  const str = JSON.stringify(data, null, 2) + '\n';

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, str);
}
