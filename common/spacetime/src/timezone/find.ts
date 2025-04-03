import type { TimezoneSet } from '../../types/types.js';
import { parseOffset } from './parseOffset.js';

/**
 * Try to find a timezone for this string.
 * Throws on unsupported timezones to be obvious (since support was removed in the fork).
 */
export function findTz(str: string | undefined, zones: TimezoneSet) {
  if (!str) {
    return 'utc';
  }
  if (typeof str !== 'string') {
    console.error(`Timezone must be a string - recieved: '${str}'\n`);
  }
  let tz = str.trim();
  tz = tz.toLowerCase();
  if (zones[tz]) {
    return tz;
  }
  //try to parse '-5h'
  if (/[0-9]/.test(tz)) {
    const id = parseOffset(tz);
    if (id) {
      return id;
    }
  }

  throw new Error('Spacetime (modified): only GMT/UTC timezones and offsets are supported');
}
