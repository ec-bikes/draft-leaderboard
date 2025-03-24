// based on https://github.com/Nfinished/chartjs-adapter-spacetime/blob/main/src/index.ts
// with en-gb style formatting

import { _adapters, type TimeUnit } from 'chart.js';
import type { Diff, ParsableDate } from 'spacetime';
import { formatDate, FORMATS, parseDate, type KnownFormatNames } from '../../common/dates.js';

function verifySupportedUnit(unit: string): asserts unit is Exclude<TimeUnit, 'quarter'> {
  if (unit === 'isoWeek' || unit === 'quarter') {
    throw new Error(`Unit "${unit}" is not supported`);
  }
}

_adapters._date.override({
  formats: () => FORMATS,

  init: () => undefined,

  parse: (value) => {
    try {
      const date = parseDate(value as ParsableDate);
      return date.epoch;
    } catch {
      return null;
    }
  },

  format: (time, format) => {
    const date = parseDate(time);
    if (format in FORMATS) {
      return formatDate(date, format as KnownFormatNames);
    }
    return date.unixFmt(format);
  },

  add: (time, amount, unit) => {
    verifySupportedUnit(unit);
    return parseDate(time).add(amount, unit).epoch;
  },

  diff: (max, min, unit) => {
    return parseDate(min).diff(parseDate(max))[`${unit}s` as keyof Diff];
  },

  startOf: (time, unit) => {
    verifySupportedUnit(unit);
    return parseDate(time).startOf(unit).epoch;
  },

  endOf: (time, unit) => {
    verifySupportedUnit(unit);
    return parseDate(time).endOf(unit).epoch;
  },
});
