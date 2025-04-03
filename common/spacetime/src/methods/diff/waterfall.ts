import type { Diff, Spacetime } from '../../../types/types.js';

type DiffUnit = keyof Diff;

/**
 * don't do anything too fancy here.
 * 2020 - 2019 may be 1 year, or 0 years
 * - '1 year difference' means 366 days during a leap year
 */
function fastYearDiff(a: Spacetime, b: Spacetime) {
  let years = b.year() - a.year();
  // should we decrement it by 1?
  a = a.year(b.year());
  if (a.isAfter(b)) {
    years -= 1;
  }
  return years;
}

/** increment until dates are the same */
function climb(a: Spacetime, b: Spacetime, unit: DiffUnit) {
  let i = 0;
  a = a.clone();
  while (a.isBefore(b)) {
    //do proper, expensive increment to catch all-the-tricks
    a = a.add(1, unit);
    i += 1;
  }
  //oops, we went too-far..
  if (a.isAfter(b)) {
    i -= 1;
  }
  return i;
}

/**
 * do a thorough +=1 on the unit, until they match.
 * for speed-reasons, only used on day, month, week.
 */
function diffOne(a: Spacetime, b: Spacetime, unit: DiffUnit) {
  const result = climb(a, b, unit);
  return a.isBefore(b) ? result : -result;
}

/**
 * use a waterfall-method for computing a diff of any 'pre-knowable' units
 * compute years, then compute months, etc..
 * ... then ms-math for any very-small units
 */
export function waterfall(a: Spacetime, b: Spacetime): Diff;
export function waterfall(a: Spacetime, b: Spacetime, unit: DiffUnit): number;
export function waterfall(a: Spacetime, b: Spacetime, unit?: DiffUnit) {
  // an hour is always the same # of milliseconds
  // so these units can be 'pre-calculated'
  const msDiff = b.epoch! - a.epoch!;
  const milliseconds = msDiff;
  if (unit === 'milliseconds') {
    return milliseconds;
  }

  const seconds = Math.floor(msDiff / 1000);
  if (unit === 'seconds') {
    return seconds;
  }

  const minutes = Math.floor(seconds / 60);
  if (unit === 'minutes') {
    return minutes;
  }

  const hours = Math.floor(minutes / 60);
  if (unit === 'hours') {
    return hours;
  }

  //do the year
  let tmp = a.clone();
  const years = fastYearDiff(tmp, b);
  if (unit === 'years') {
    return years;
  }

  tmp = a.add(years, 'year');

  //there's always 12 months in a year...
  let months = years * 12;
  tmp = a.add(months, 'month');
  months += diffOne(tmp, b, 'months');
  if (unit === 'months') {
    return months;
  }

  // there's always atleast 52 weeks in a year..
  // (month * 4) isn't as close
  let weeks = years * 52;
  tmp = a.add(weeks, 'week');
  weeks += diffOne(tmp, b, 'weeks');
  if (unit === 'weeks') {
    return weeks;
  }

  // there's always atleast 7 days in a week
  let days = weeks * 7;
  tmp = a.add(days, 'day');
  days += diffOne(tmp, b, 'days');
  if (unit === 'days') {
    return days;
  }

  if (unit) {
    throw new Error(`Unit "${unit}" not supported for diff`);
  }

  return { milliseconds, seconds, minutes, hours, days, weeks, months, years };
}
