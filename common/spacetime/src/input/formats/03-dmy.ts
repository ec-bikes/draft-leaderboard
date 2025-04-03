import walkTo from '../../methods/set/walk.js';
import { toCardinal } from '../../helpers.js';
import { validate, parseTime, parseYear, parseMonth } from './_parsers.js';
import type { Parser } from '../../../types/types.js';

/** d-m-y */
export const parsers: Parser[] = [
  //common british format - "25-feb-2015"
  {
    reg: /^([0-9]{1,2})[-/]([a-z]+)[-/]?([0-9]{4})?$/i,
    parse: (s, m) => {
      const obj = {
        // year: parseYear(m[3], s._today),
        year: parseYear(m[3]),
        month: parseMonth(m[2]),
        date: toCardinal(m[1] || ''),
      };
      if (!validate(obj)) {
        s.epoch = null;
        return s;
      }
      walkTo(s, obj);
      s = parseTime(s, m[4]);
      return s;
    },
  },
  // "25 Mar 2015"
  {
    reg: /^([0-9]{1,2})( [a-z]+)( [0-9]{4}| '[0-9]{2})? ?([0-9]{1,2}:[0-9]{2}:?[0-9]{0,2} ?(am|pm|gmt))?$/i,
    parse: (s, m) => {
      const obj = {
        // year: parseYear(m[3], s._today),
        year: parseYear(m[3]),
        month: parseMonth(m[2]),
        date: toCardinal(m[1]),
      };
      if (!obj.month || !validate(obj)) {
        s.epoch = null;
        return s;
      }
      walkTo(s, obj);
      s = parseTime(s, m[4]);
      return s;
    },
  },
  // 01-jan-2020
  {
    reg: /^([0-9]{1,2})[. \-/]([a-z]+)[. \-/]([0-9]{4})?( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (s, m) => {
      const obj = {
        date: Number(m[1]),
        month: parseMonth(m[2]),
        year: Number(m[3]),
      };
      if (!validate(obj)) {
        s.epoch = null;
        return s;
      }
      walkTo(s, obj);
      s = s.startOf('day');
      s = parseTime(s, m[4]);
      return s;
    },
  },
];
