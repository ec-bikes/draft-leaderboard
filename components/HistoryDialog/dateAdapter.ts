// based on https://github.com/bolstycjw/chartjs-adapter-dayjs-4/blob/master/src/index.ts
// with support for quarters and ISO weekdays removed

import { _adapters } from 'chart.js';
import dayjs from 'dayjs/esm/index.js';
import type { TimeUnit } from 'chart.js';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index.js';
import utc from 'dayjs/esm/plugin/utc/index.js';
import enGb from 'dayjs/esm/locale/en-gb.js';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.locale('en-gb');

const utcDate = dayjs.utc;

const FORMATS: Record<TimeUnit | 'datetime', string> = {
  datetime: enGb.formats.LLL!,
  millisecond: `${enGb.formats.LTS!}.SSS`,
  second: enGb.formats.LTS!,
  minute: enGb.formats.LT!,
  hour: 'HH',
  day: 'D MMM',
  week: 'll',
  month: 'MMM YYYY',
  quarter: '',
  year: 'YYYY',
};

function verifyUnit(unit: TimeUnit | 'isoWeek'): asserts unit is Exclude<TimeUnit, 'quarter'> {
  if (unit === 'quarter' || unit === 'isoWeek') {
    throw new Error(`${unit} is not supported`);
  }
}

_adapters._date.override({
  formats: () => FORMATS,
  parse: function (value, format) {
    if (value === null || typeof value === 'undefined') {
      return null;
    }
    if (!(value instanceof dayjs)) {
      const date = utcDate(value as any, format);
      return date.isValid() ? date.valueOf() : null;
    }
    return null;
  },
  format: function (time, format) {
    return utcDate(time).format(format);
  },
  add: function (time, amount, unit) {
    verifyUnit(unit);
    return utcDate(time).add(amount, unit).valueOf();
  },
  diff: function (max, min, unit) {
    return utcDate(max).diff(utcDate(min), unit);
  },
  startOf: function (time, unit) {
    verifyUnit(unit);
    return utcDate(time).startOf(unit).valueOf();
  },
  endOf: function (time, unit) {
    verifyUnit(unit);
    return utcDate(time).endOf(unit).valueOf();
  },
});
