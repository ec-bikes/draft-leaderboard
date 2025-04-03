import { titleCase, zeroPad } from '../../helpers.js';
import { short } from '../../data/months.js';
import { short as _short } from '../../data/days.js';
import { useTitleCase } from '../../data/caseFormat.js';
import isoOffset from './_offset.js';
import type { Spacetime } from '../../../types/types.js';
import type { Format } from '../../../types/constraints.js';

const shortDays = _short();

const applyCaseFormat = (str: string) => {
  if (useTitleCase()) {
    return titleCase(str);
  }
  return str;
};

const formats: Record<string, ((s: Spacetime) => string | number) | undefined> = {
  day: (s) => applyCaseFormat(s.dayName()),
  'day-short': (s) => applyCaseFormat(shortDays[s.dayOfWeek()]),
  'day-number': (s) => s.dayOfWeek(),
  'day-pad': (s) => zeroPad(s.dayOfWeek()),

  date: (s) => s.date(),
  'date-pad': (s) => zeroPad(s.date()),

  month: (s) => applyCaseFormat(s.monthName()),
  'month-short': (s) => applyCaseFormat(short()[s.month()]),
  'month-number': (s) => s.month(),
  'month-pad': (s) => zeroPad(s.month()),
  'iso-month': (s) => zeroPad(s.month() + 1), //1-based months

  year: (s) => s.year(),
  'year-short': (s) => {
    const year = s.year();
    return `'${String(year).slice(2, 4)}`;
  },
  'iso-year': (s) => zeroPad(s.year(), 4),

  time: (s) => s.time(),
  'time-24': (s) => `${s.hour()}:${zeroPad(s.minute())}`,

  hour: (s) => s.hour12(),
  'hour-pad': (s) => zeroPad(s.hour12()),
  'hour-24': (s) => s.hour(),
  'hour-24-pad': (s) => zeroPad(s.hour()),

  minute: (s) => s.minute(),
  'minute-pad': (s) => zeroPad(s.minute()),
  second: (s) => s.second(),
  'second-pad': (s) => zeroPad(s.second()),
  millisecond: (s) => s.millisecond(),
  'millisecond-pad': (s) => zeroPad(s.millisecond(), 3),

  ampm: (s) => s.ampm(),
  AMPM: (s) => s.ampm().toUpperCase(),
  offset: (s) => isoOffset(s),

  numeric: (s) => `${s.year()}/${zeroPad(s.month() + 1)}/${zeroPad(s.date())}`, // yyyy/mm/dd
  'numeric-us': (s) => `${zeroPad(s.month() + 1)}/${zeroPad(s.date())}/${s.year()}`, // mm/dd/yyyy
  'numeric-uk': (s) => `${zeroPad(s.date())}/${zeroPad(s.month() + 1)}/${s.year()}`, //dd/mm/yyyy
  'mm/dd': (s) => `${zeroPad(s.month() + 1)}/${zeroPad(s.date())}`, //mm/dd

  // ... https://en.wikipedia.org/wiki/ISO_8601 ;(((
  iso: (s) => {
    const d = s.d;
    const year = zeroPad(d.getFullYear(), 4);
    const month = zeroPad(d.getMonth() + 1); //1-based months
    const date = zeroPad(d.getDate());
    const hour = zeroPad(d.getHours());
    const minute = zeroPad(d.getMinutes());
    const second = zeroPad(d.getSeconds());
    const ms = zeroPad(d.getMilliseconds(), 3);
    const offset = isoOffset(s);
    //2018-03-09T08:50:00.000-05:00
    return `${year}-${month}-${date}T${hour}:${minute}:${second}.${ms}${offset}`;
  },
  'iso-short': (s) => {
    const month = zeroPad(s.month() + 1); //1-based months
    const date = zeroPad(s.date());
    const year = zeroPad(s.year(), 4);
    return `${year}-${month}-${date}`; //2017-02-15
  },
  'iso-utc': (s) => {
    return s.toNativeDate().toISOString(); //2017-03-08T19:45:28.367Z
  },

  //i made these up
  nice: (s) => `${short()[s.month()]} ${s.date()}, ${s.time()}`,
  'nice-24': (s) => `${short()[s.month()]} ${s.date()}, ${s.hour()}:${zeroPad(s.minute())}`,
  'nice-year': (s) => `${short()[s.month()]} ${s.date()}, ${s.year()}`,
  'nice-day': (s) =>
    `${_short()[s.dayOfWeek()]} ${applyCaseFormat(short()[s.month()])} ${s.date()}`,
  'nice-full': (s) => `${s.dayName()} ${applyCaseFormat(s.monthName())} ${s.date()}, ${s.time()}`,
  'nice-full-24': (s) =>
    `${s.dayName()} ${applyCaseFormat(s.monthName())} ${s.date()}, ${s.hour()}:${zeroPad(s.minute())}`,
};
const aliases: Record<string, string> = {
  'day-name': 'day',
  'month-name': 'month',
  'iso 8601': 'iso',
  'time-12': 'time',
  tz: 'timezone',
  'day-num': 'day-number',
  'month-num': 'month-number',
  'month-iso': 'iso-month',
  'year-iso': 'iso-year',
  'nice-short': 'nice',
  'nice-short-24': 'nice-24',
  mdy: 'numeric-us',
  dmy: 'numeric-uk',
  ymd: 'numeric',
  'yyyy/mm/dd': 'numeric',
  'mm/dd/yyyy': 'numeric-us',
  'dd/mm/yyyy': 'numeric-us',
  'day-nice': 'nice-day',
};
Object.keys(aliases).forEach((k) => (formats[k] = formats[aliases[k]]));

/**
 * Output nicely-formatted strings.
 * @param fmt Must be a valid format name, or a string with `{format}` tokens inside it
 * (where the tokens are valid format names)
 */
export function format(s: Spacetime, fmt: Format | string) {
  //don't print anything if it's an invalid date
  if (!s.isValid()) {
    return '';
  }
  //support .format('month')
  if (fmt in formats) {
    const out = String(formats[fmt]!(s) ?? '');
    return fmt.toLowerCase() !== 'ampm' ? applyCaseFormat(out) : out;
  }
  //support '{hour}:{minute}' notation
  if (fmt.includes('{')) {
    const sections = /\{(.+?)\}/g;
    fmt = fmt.replace(sections, (_, fmtPart) => {
      fmtPart = fmtPart.trim();
      if (fmtPart !== 'AMPM') {
        fmtPart = fmtPart.toLowerCase();
      }
      return fmtPart in formats ? format(s, fmtPart) : '';
    });
    return fmt;
  }

  return format(s, 'iso-short');
}
