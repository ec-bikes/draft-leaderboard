import type { TimeUnit } from '../../../types/constraints.js';
import type { Diff, ParsableDate, Spacetime } from '../../../types/types.js';
import { ensureDate, normalizeUnit } from '../../helpers.js';
import { waterfall } from './waterfall.js';

/**
 * Given two dates, count how many of a unit you'd need to make them equal.
 *
 * '1 month' means 28 days in february.
 * '1 year' means 366 days in a leap year.
 */
export function diff(a: Spacetime, b: ParsableDate, unit: TimeUnit): number;
export function diff(a: Spacetime, b: ParsableDate): Diff;
export function diff(a: Spacetime, b: ParsableDate, unit?: TimeUnit) {
  b = ensureDate(b, a);

  //reverse values, if necessary
  let reversed = false;
  if (a.isAfter(b)) {
    [a, b] = [b, a];
    reversed = true;
  }

  //return just the requested unit
  if (unit) {
    //make sure it's plural-form
    unit = normalizeUnit(unit) as TimeUnit;
    if (!unit.endsWith('s')) {
      unit += 's';
    }
    if (unit === 'dates') {
      unit = 'days';
    }
    const result = waterfall(a, b, unit as keyof Diff);
    return reversed ? -result : result;
  }

  const obj = waterfall(a, b);

  if (reversed) {
    Object.keys(obj).forEach((k) => {
      obj[k as keyof Diff] *= -1;
    });
  }
  return obj;
}
