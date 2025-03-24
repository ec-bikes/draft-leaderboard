// This project uses a patched version of spacetime which only supports UTC/GMT.
import spacetime, {
  type ParsableDate,
  type Spacetime,
  type SpacetimeConstructorOptions,
} from 'spacetime';

/**
 * Spacetime date/time object.
 * The ones returned by this project's date utils will always use UTC/GMT time.
 */
export type SafeDate = Spacetime;

/**
 * en-GB `spacetime` format strings for chart.js standard date/time units and other common formats.
 */
export const FORMATS = {
  // Unfortunately this format isn't well-documented and diverges from moment/etc...
  // https://github.com/spencermountain/spacetime/blob/master/src/methods/format/unixFmt.js
  // Compare: https://momentjs.com/docs/#/displaying/
  // yyyy = 4 digit year
  // M = numeric month (1-12)
  // MM = padded numeric month (01-12)
  // MMM = short month name (Jan, ...)
  // MMMM = full month name (January, ...)
  // d = numeric day of month (1-31)
  //       MOMENT: D (spacetime D is day of year??)
  // dd = padded numeric day of month (01-31)
  //       MOMENT: DD
  // H = 24 hour (0-23)
  // HH = padded 24 hour (00-23)

  /** ISO YYYY-MM-DD */
  isoDate: 'yyyy-MM-dd',
  /** en-GB e.g. "9 Mar 2025" */
  shortDate: 'd MMM yyyy',
  /** en-GB e.g. "9 March 2025" */
  longDate: 'd MMMM yyyy',

  // these are chartjs standard time unit/format names
  /** datetime with long month and time zone (no seconds) */
  datetime: 'd MMMM yyyy HH:mm z',
  millisecond: `HH:mm:ss.SSS`,
  second: 'HH:mm:ss',
  minute: 'HH:mm',
  hour: 'HH',
  day: 'd MMM',
  week: 'll',
  month: 'MMM YYYY',
  quarter: "'Q'Q '-' yyyy",
  year: 'YYYY',
};

export type KnownFormatNames = keyof typeof FORMATS;

/**
 * Get a spacetime object in UTC/GMT time from a date string or other value.
 * Throws if the value is invalid.
 */
export function parseDate(value: ParsableDate, options?: SpacetimeConstructorOptions): SafeDate {
  const date = spacetime(value, 'GMT', options);
  if (!date.isValid()) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

/**
 * Format a date as a string in UTC/GMT. (Use `date.unixFmt()` for custom formats.)
 *
 * - `isoDate`: YYYY-MM-DD
 * - `shortDate`: e.g. "22 Mar 2024"
 * - `datetime`: e.g. "19 Mar 2024, 02:01 GMT"
 */
export function formatDate(date: SafeDate | string, format: KnownFormatNames): string {
  if (typeof date === 'string') {
    date = parseDate(date);
  }
  if (!(format in FORMATS)) {
    throw new Error(`Invalid date format: "${format}" (use date.unixFmt() for custom formats)`);
  }
  return date.unixFmt(FORMATS[format as KnownFormatNames]);
}

/** Get the current date/time (UTC/GMT) */
export function now(): SafeDate {
  return spacetime.now('GMT');
}

/** Get the date/time for the beginning of today (UTC/GMT) */
export function today(): SafeDate {
  return spacetime.today('GMT');
}
