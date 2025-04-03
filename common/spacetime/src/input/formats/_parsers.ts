import { monthLengths } from '../../data/monthLengths.js';
import { daysInMonth } from '../../helpers.js';
import { mapping } from '../../data/months.js';
import type { SpacetimeJson } from '../../../types/types.js';

const months = mapping();

export { parseOffset } from './parseOffset.js';
export { parseTime } from './parseTime.js';

/** Validate the month and day */
export function validate(obj: Pick<SpacetimeJson, 'date' | 'month' | 'year'>) {
  if (!(obj.month in monthLengths)) {
    return false;
  }
  const maxValid = daysInMonth(obj);
  return obj.date >= 1 && obj.date <= maxValid;
}

// const parseYear = (str = '', today) => {
export function parseYear(str = '') {
  str = str.trim();
  // parse '86 shorthand
  if (/^'[0-9][0-9]$/.test(str) === true) {
    const num = Number(str.replace(/'/, ''));
    if (num > 50) {
      return 1900 + num;
    }
    return 2000 + num;
  }
  const year = parseInt(str, 10);
  // use a given year from options.today
  // if (!year && today) {
  //   year = today.year;
  // }
  // fallback to this year
  return year || new Date().getFullYear();
}

export function parseMonth(str: string): number | undefined {
  str = str.toLowerCase().trim();
  if (str === 'sept') {
    return months.sep;
  }
  return months[str as keyof typeof months];
}

export function parseTz(str: string) {
  str = str.trim();
  str = str.replace(/[[\]]/g, '');
  return str;
}
