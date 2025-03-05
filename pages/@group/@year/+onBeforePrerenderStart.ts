import { onBeforePrerenderStart as upperPrerender } from '../+onBeforePrerenderStart.js';
import { years } from '../../../common/constants.js';

// Used to generate static pages for each URL (required by github pages)
export function onBeforePrerenderStart() {
  return upperPrerender()
    .map((url) => years.map((year) => `${url}/${year}`))
    .flat();
}
