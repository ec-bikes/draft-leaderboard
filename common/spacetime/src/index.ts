import type { SpacetimeConstructorOptions } from '../types/constructors.js';
import type { ParsableDate } from '../types/types.js';
import { startOf } from './methods.js';
import { SpacetimeImpl } from './spacetime.js';

export function spacetime(input: ParsableDate, tz?: string, options?: SpacetimeConstructorOptions) {
  return new SpacetimeImpl(input, tz, options);
}

// // set all properties of a given 'today' object
// function setToday(s: Spacetime) {
//   const today = s._today || {};
//   Object.keys(today).forEach((k) => {
//     s = s[k](today[k]);
//   });
//   return s;
// }

/** set as the current time */
export function now(tz?: string, options?: SpacetimeConstructorOptions) {
  const s = new SpacetimeImpl(Date.now(), tz, options);
  // setToday(s);
  return s;
}

/** set as this morning */
export function today(tz?: string, options?: SpacetimeConstructorOptions) {
  const s = new SpacetimeImpl(Date.now(), tz, options);
  // setToday(s);
  return startOf(s, 'day');
}

/** set as tomorrow morning */
export function tomorrow(tz?: string, options?: SpacetimeConstructorOptions) {
  const s = new SpacetimeImpl(Date.now(), tz, options);
  // setToday(s);
  return s.add(1, 'day').startOf('day');
}

/** set as yesterday morning */
export function yesterday(tz?: string, options?: SpacetimeConstructorOptions) {
  const s = new SpacetimeImpl(Date.now(), tz, options);
  // setToday(s);
  return s.subtract(1, 'day').startOf('day');
}

/** get a list of current timezones and their offsets  */
export function timezones() {
  const s = new SpacetimeImpl(0);
  return s.timezones;
}

/** set as earliest-possible date */
export function max() {
  const s = new SpacetimeImpl(8640000000000000);
  return s;
}

/** set as furthest-possible future date */
export function min() {
  const s = new SpacetimeImpl(-8640000000000000);
  return s;
}
