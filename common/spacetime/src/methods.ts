import { withDate } from './helpers.js';
import type { Spacetime, SpacetimeJson } from '../types/types.js';

export { diff } from './methods/diff/index.js';
export { format } from './methods/format/index.js';
export { unixFmt } from './methods/format/unixFmt.js';
export { startOf, endOf } from './methods/startOf.js';
export { withDate };

const units = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'] as const;

export function withTimezone(s: Spacetime, tz: string) {
  const json = toJson(s);
  json.timezone = tz;
  return withDate(s, json, tz);
}

export function toJson(s: Spacetime) {
  const obj = {
    offset: s.offset(),
    timezone: s.tz,
  } as SpacetimeJson;

  for (const unit of units) {
    obj[unit] = s[unit]();
  }
  return obj;
}
