import type { ParsableDate, Spacetime, SpacetimeJson } from '../types/types.js';
import { monthLengths } from './data/monthLengths.js';
import { setFromInput } from './input/index.js';

export function isLeapYear(year: number | string) {
  year = Number(year);
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// unsurprisingly-nasty `typeof date` call
export function isDate(d: unknown): d is Date {
  return Object.prototype.toString.call(d) === '[object Date]' && !isNaN((d as Date).valueOf());
}

export function isObject(input: unknown): input is object {
  return Object.prototype.toString.call(input) === '[object Object]';
}

export function zeroPad(str: string | number, len = 2) {
  const pad = '0';
  str = str + '';
  return str.length >= len ? str : new Array(len - str.length + 1).join(pad) + str;
}

export function titleCase(str: string) {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.substr(1);
}

/** strip 'st' off '1st' */
export function toCardinal(str: string | number) {
  str = String(str);
  str = str.replace(/([0-9])(st|nd|rd|th)$/i, '$1');
  return parseInt(str, 10);
}

/** used mostly for cleanup of unit names, like 'months' */
export function normalizeUnit(str = '') {
  str = str.toLowerCase().trim();
  str = str.replace(/s$/, '');
  str = str.replace(/-/g, '');
  if (str === 'day' || str === 'days') {
    return 'date';
  }
  if (str === 'min' || str === 'mins') {
    return 'minute';
  }
  return str;
}

export function getEpoch(tmp: Spacetime | number | Date) {
  //support epoch
  if (typeof tmp === 'number') {
    return tmp;
  }
  //suport date objects
  if (isDate(tmp)) {
    return tmp.getTime();
  }
  // support spacetime objects
  if (tmp.epoch || tmp.epoch === 0) {
    return tmp.epoch;
  }
  return null;
}

/** Copy the date and update it with the given properties. */
export function withDate(s: Spacetime, date: ParsableDate | Partial<SpacetimeJson>, tz?: string) {
  s = s.clone();
  setFromInput(s, date);
  if (tz) {
    s.tz = tz;
  }
  return s;
}

/** make sure this input is a spacetime obj */
export function ensureDate(d: ParsableDate, s: Spacetime) {
  return isObject(d) ? (d as Spacetime) : withDate(s, d);
}

export function formatTimezone(offset: number, delimiter = '') {
  const sign = offset > 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = zeroPad(parseInt('' + absOffset, 10));
  const minutes = zeroPad((absOffset % 1) * 60);
  return `${sign}${hours}${delimiter}${minutes}`;
}

/** Get the number of days in the month, accounting for leap years */
export function daysInMonth(obj: Spacetime | Pick<SpacetimeJson, 'month' | 'year'>) {
  const month = typeof obj.month === 'number' ? obj.month : obj.month();
  const year = typeof obj.year === 'number' ? obj.year : obj.year();
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return monthLengths[month];
}

/** Clamp the date in a month to a valid value */
export function clampDayInMonth(obj: Spacetime | Pick<SpacetimeJson, 'month' | 'year' | 'date'>) {
  const date = typeof obj.date === 'number' ? obj.date : obj.date();
  if (date < 1) return 1;
  const monthLength = daysInMonth(obj);
  return Math.min(date, monthLength);
}

/** Clamp a month number in the valid 0-11 range */
export function clampMonth(month: number) {
  return month < 0 ? 0 : month > 11 ? 11 : month;
}
