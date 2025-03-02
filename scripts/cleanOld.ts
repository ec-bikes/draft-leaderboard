import { groups } from '../common/constants.js';
import { cleanUpFiles } from './data/cleanUpFiles.js';

for (const group of groups) {
  cleanUpFiles(group);
}
