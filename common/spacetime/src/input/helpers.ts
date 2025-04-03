import type { Spacetime, SpacetimeJson } from '../../types/types.js';

const defaults: Partial<SpacetimeJson> = {
  year: new Date().getFullYear(),
  month: 0,
  date: 1,
};

const units = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'] as const;

/** support [2016, 03, 01] format */
// export function parseArray(s, arr, today) {
export function setFromArray(s: Spacetime, arr: number[]): void {
  if (arr.length === 0) {
    return;
  }
  for (let i = 0; i < units.length; i++) {
    // const num = arr[i] || today[units[i]] || defaults[units[i]] || 0;
    const num = arr[i] || defaults[units[i]] || 0;
    s = s[units[i]](num) as Spacetime;
  }
}

/** support {year:2016, month:3} format */
export function setFromObject(s: Spacetime, obj: Partial<SpacetimeJson>): void {
  if (Object.keys(obj).length === 0) {
    return;
  }
  obj = Object.assign({}, defaults, obj);
  if (obj.timezone) {
    s.tz = obj.timezone;
  }
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (obj[unit] !== undefined) {
      s = s[unit](obj[unit]) as Spacetime;
    }
  }
}

/**
 * this may seem like an arbitrary number, but it's 'within jan 1970'
 * this is only really ambiguous until 2054 or so
 */
export function setFromNumber(s: Spacetime, input: number): void {
  const minimumEpoch = 2500000000;
  // if the given epoch is really small, they've probably given seconds and not milliseconds
  // anything below this number is likely (but not necessarily) a mistaken input.
  if (input > 0 && input < minimumEpoch && s.silent === false) {
    console.warn('  - Warning: You are setting the date to January 1970.');
    console.warn('       -   did input seconds instead of milliseconds?');
  }
  s.epoch = input;
}
