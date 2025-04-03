import walkTo from '../../methods/set/walk.js';
import { toCardinal } from '../../helpers.js';
import { validate, parseTime, parseYear, parseMonth, parseOffset, parseTz } from './_parsers.js';
import type { Parser } from '../../../types/types.js';

/** y-m-d */
export const parsers: Parser[] = [
  //iso-this 1998-05-30T22:00:00:000Z, iso-that 2017-04-03T08:00:00-0700
  // optionally supports Temporal fmt w/ [IANA]
  {
    reg: /^(-?0{0,2}[0-9]{3,4})-([0-9]{1,2})-([0-9]{1,2})[T| ]([0-9.:]+)(Z|[0-9-+:]+)?(\[.*?\])?(\[.*?\])?$/i,
    parse: (s, m) => {
      const obj = {
        year: Number(m[1]),
        month: Number(m[2]) - 1,
        date: Number(m[3]),
      };
      if (!validate(obj)) {
        s.epoch = null;
        return s;
      }
      // if iana code in brackets at the end, set the timezone
      if (m[6]) {
        const tz = parseTz(m[6]); //TODO addme
        if (tz) {
          s = s.timezone(tz);
        }
      } else {
        parseOffset(s, m[5]);
      }
      // For now, ignore Temporal calendar info in m[7]..
      walkTo(s, obj);
      s = parseTime(s, m[4]);
      return s;
    },
  },
  //short-iso "2015-03-25" or "2015/03/25" or "2015/03/25 12:26:14 PM"
  {
    reg: /^([0-9]{4})[-/. ]([0-9]{1,2})[-/. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (s, m) => {
      const obj = {
        year: m[1],
        month: parseInt(m[2], 10) - 1,
        date: parseInt(m[3], 10),
      };
      if (obj.month >= 12) {
        //support yyyy/dd/mm (weird, but ok)
        obj.date = parseInt(m[2], 10);
        obj.month = parseInt(m[3], 10) - 1;
      }
      if (!validate(obj)) {
        s.epoch = null;
        return s;
      }
      walkTo(s, obj);
      s = parseTime(s, m[4]);
      return s;
    },
  },

  //text-month "2015-feb-25"
  {
    reg: /^([0-9]{4})[-/. ]([a-z]+)[-/. ]([0-9]{1,2})( [0-9]{1,2}(:[0-9]{0,2})?(:[0-9]{0,3})? ?(am|pm)?)?$/i,
    parse: (s, m) => {
      const obj = {
        // year: parseYear(m[1], s._today),
        year: parseYear(m[1]),
        month: parseMonth(m[2]),
        date: toCardinal(m[3] || ''),
      };
      if (obj.month === undefined || !validate(obj)) {
        s.epoch = null;
        return s;
      }
      walkTo(s, obj);
      s = parseTime(s, m[4]);
      return s;
    },
  },
];
