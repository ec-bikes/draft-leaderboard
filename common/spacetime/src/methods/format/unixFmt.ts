import type { Spacetime } from '../../../types/types.js';
import { formatTimezone, zeroPad as pad } from '../../helpers.js';
import { format } from './index.js';
//parse this insane unix-time-templating thing, from the 19th century
//http://unicode.org/reports/tr35/tr35-25.html#Date_Format_Patterns

//time-symbols we support
const mapping: Record<string, ((s: Spacetime) => string | number) | undefined> = {
  //year
  y: (s) => s.year(),
  //last two chars
  yy: (s) => pad(Number(String(s.year()).slice(2, 4))),
  yyy: (s) => s.year(),
  yyyy: (s) => s.year(),
  yyyyy: (s) => '0' + s.year(),

  //month
  M: (s) => s.month() + 1,
  MM: (s) => pad(s.month() + 1),
  MMM: (s) => format(s, 'month-short'),
  MMMM: (s) => format(s, 'month'),

  //week
  w: (s) => s.week(),
  ww: (s) => pad(s.week()),

  //date of month
  d: (s) => s.date(),
  dd: (s) => pad(s.date()),

  //day
  E: (s) => format(s, 'day-short'),
  EE: (s) => mapping.E!(s),
  EEE: (s) => mapping.E!(s),
  EEEE: (s) => format(s, 'day'),
  EEEEE: (s) => format(s, 'day')[0],
  e: (s) => s.day(),
  ee: (s) => s.day(),
  eee: (s) => mapping.E!(s),
  eeee: (s) => format(s, 'day'),
  eeeee: (s) => format(s, 'day')[0],

  //am/pm
  a: (s) => s.ampm().toUpperCase(),

  //hour
  h: (s) => s.h12(),
  hh: (s) => pad(s.h12()),
  H: (s) => s.hour(),
  HH: (s) => pad(s.hour()),

  m: (s) => s.minute(),
  mm: (s) => pad(s.minute()),
  s: (s) => s.second(),
  ss: (s) => pad(s.second()),

  //milliseconds
  SSS: (s) => pad(s.millisecond(), 3),
  //timezone
  z: (s) => s.timezone().name,
  Z: (s) => formatTimezone(s.timezone().offset),
  ZZZZ: (s) => formatTimezone(s.timezone().offset, ':'),
};

const addAlias = (char: string, to: string, n: number) => {
  for (let i = 1; i <= n; i++) {
    mapping[char.repeat(i)] = mapping[to.repeat(i)];
  }
};
addAlias('Y', 'y', 4);
addAlias('S', 's', 2);

/** support unix-style escaping with ' character */
function escapeChars(arr: string[]) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === `'`) {
      // greedy-search for next apostrophe
      for (let o = i + 1; o < arr.length; o += 1) {
        if (arr[o]) {
          arr[i] += arr[o];
        }
        if (arr[o] === `'`) {
          arr[o] = '';
          break;
        }
        arr[o] = '';
      }
    }
  }
  return arr.filter((ch) => ch);
}

/** combine consecutive chars, like 'yyyy' as one. */
function combineRepeated(arr: string[]) {
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    // greedy-forward
    for (let o = i + 1; o < arr.length; o++) {
      if (arr[o] === c) {
        arr[i] += arr[o];
        arr[o] = '';
      } else {
        break;
      }
    }
  }
  // '' means one apostrophe
  return arr.filter((ch) => !!ch).map((str) => (str === `''` ? `'` : str));
}

export function unixFmt(s: Spacetime, fmt: string) {
  let arr = fmt.split('');
  // support character escaping
  arr = escapeChars(arr);
  //combine 'yyyy' as string.
  arr = combineRepeated(arr);
  return arr
    .map((c) => {
      if (mapping[c]) {
        return mapping[c]!(s) || '';
      }
      // 'unescape'
      if (/^'.+'$/.test(c)) {
        c = c.replace(/'/g, '');
      }
      return c;
    })
    .join('');
}
