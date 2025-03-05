import { groups } from '../common/constants.js';
import { cleanUpFiles } from './utils/cleanUpFiles.js';

for (const group of groups) {
  cleanUpFiles(group, 2025);
}
