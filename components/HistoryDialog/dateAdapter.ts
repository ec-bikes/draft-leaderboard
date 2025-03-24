// based on https://github.com/Nfinished/chartjs-adapter-spacetime/blob/main/src/index.ts
// with en-gb style formatting

import { _adapters } from 'chart.js';
import type { Diff, ParsableDate } from 'spacetime';
import { formatDate, FORMATS, parseDate, type KnownFormatNames } from '../../common/dates.js';

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
    return parseDate(time).add(amount, unit).epoch;
  },

  diff: (max, min, unit) => {
    return parseDate(min).diff(parseDate(max))[`${unit}s` as keyof Diff];
  },

  startOf: (time, unit) => {
    if (unit === 'isoWeek') {
      throw new Error('isoWeek is not supported');
    }
    return parseDate(time).startOf(unit).epoch;
  },

  endOf: (time, unit) => {
    return parseDate(time).endOf(unit).epoch;
  },
});
