import type { Spacetime } from '../../types/types.js';

/**
 * This method avoids having to do a full dst-calculation on every operation.
 * It reproduces some things in ./index.js, but speeds up spacetime considerably.
 */
export function quickOffset(s: Spacetime) {
  const zones = s.timezones;
  const obj = zones[s.tz];
  if (obj === undefined) {
    console.warn("Warning: couldn't find timezone " + s.tz);
    return 0;
  }
  return obj.offset;
}
export default quickOffset;
