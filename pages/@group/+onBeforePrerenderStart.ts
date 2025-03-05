import { groups } from '../../common/constants.js';

// Used to generate static pages for each URL (required by github pages)
export function onBeforePrerenderStart() {
  return groups.map((group) => `/${group}`);
}
