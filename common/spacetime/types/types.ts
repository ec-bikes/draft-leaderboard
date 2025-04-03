import type { TimeUnit } from './constraints.js';

/** a date/timezone object */
export interface Spacetime {
  /** epoch in milliseconds */
  epoch: number | null;

  /** whether warnings are enabled */
  readonly silent: boolean;

  /**
   * The timezone name. Throws when set if not supported.
   * (NOTE: in the real version, this is the tz database name, like 'America/Denver',
   * but here only UTC or GMT with offsets are supported.)
   */
  tz: string;

  /** the **global** tz database nameset (can be updated) */
  timezones: TimezoneSet;

  /** favour british interpretation of 02/02/2018, etc */
  readonly british: boolean;

  /**
   * @internal Internal use only: generate an offset-corrected date so the values of
   * days, hours, etc will be as expected.
   */
  get d(): Date;

  // /** move to a new timezone, but at this same moment. Accepts an IANA code or abbreviation */
  // goto: (target: string | null) => Spacetime;

  /** @returns a copy of this object, with no references to the original */
  clone(): Spacetime;

  /** @returns the native Date object at the same epoch */
  toNativeDate(): Date;

  // /** @returns native Date object shifted for local time */
  // toNativeLocalDate(): Date;

  // /** output formatted string using unix formatting code (yyyy.MM.dd h:mm a) */
  // unixFmt(format: string): string;

  /** move to the first millisecond of the day, week, month, year, etc. */
  startOf(unit: TimeUnit): Spacetime;

  /** move to the last millisecond of the day, week, month, year, etc. */
  endOf(unit: TimeUnit): Spacetime;

  /** increment the time by a number and unit - like an hour, minute, day, or year */
  add(value: number, unit: TimeUnit): Spacetime;

  /** decrease the time by a number and unit - like an hour, minute, day, or year */
  subtract(value: number, unit: TimeUnit): Spacetime;

  /** pass-in a spacetime object or date input and see if it takes-place after your spacetime date/time */
  isAfter(date: Spacetime | Date, isInclusive?: boolean): boolean;

  /** pass-in a spacetime object or date input and see if it takes-place before your spacetime date/time */
  isBefore(date: Spacetime | Date, isInclusive?: boolean): boolean;

  /** is this date on the exact same millisecond as another */
  isEqual(date: Spacetime | Date): boolean;

  /** is this date between these start and end dates? */
  isBetween(start: Spacetime | Date, end: Spacetime | Date, isInclusive?: boolean): boolean;

  /** detect if two date/times are the same day, week, or year, etc */
  isSame(
    date: Spacetime | Date | TimeUnit,
    unit: Spacetime | Date | TimeUnit,
    tzSensitive?: boolean,
  ): boolean;

  /** does this time exist on the gregorian/javascript calendar? */
  isValid(): boolean;

  /** the time-difference from UTC, in hours */
  offset(): number;

  /** get the current number of milliseconds (0-999) */
  millisecond(): number;
  // /** set the current number of milliseconds (0-999) */
  // millisecond(value: number): Spacetime;

  /** get the current number of seconds (0-59) */
  second(): number;
  // /** set the current number of seconds (0-59) */
  // second(value: number, goForward?: boolean): Spacetime;

  /** get the current number of minutes (0-59) */
  minute(): number;
  // /** set the current number of minutes (0-59) */
  // minute(value: number, goForward?: boolean): Spacetime;

  /** get the current hour, in 24 time (0-23). */
  hour(): number;
  // /** set the current hour, in 24 time (0-23). also accepts/parses '3pm' */
  // hour(value: number | string, goForward?: boolean): Spacetime;

  /** get the current hour, in 12-hour format (0-11). */
  hour12(): number;
  // /** set the current hour, in 12-hour format (0-11). also accepts/parses '3pm' */
  // hour12(value: number | string, goForward?: boolean): Spacetime;

  // /** get the date/time as ISO 8601 */
  // iso(): string;
  // /** set the date/time/offset from a ISO 8601 string */
  // iso(iso: string): Spacetime;

  /** get the day-number of the month (1- max31) */
  date(): number;
  // /** set the day-number of the month (1- max31) */
  // date(value: number, goForward?: boolean): Spacetime;

  /** get the zero-based month-number (0-11). */
  month(): number;
  // /** set the zero-based month-number (0-11). Also accepts 'June', or 'oct'. */
  // month(value: string | number, goForward?: boolean): Spacetime;

  /** get the 4-digit year as an integer */
  year(): number;
  // /** set the 4-digit year as an integer */
  // year(value: number): Spacetime;

  /** get the day of the week as an integer, starting on sunday (day-0) */
  dayOfWeek(): number;
  // /** set the day of the week as an integer, starting on sunday (day-0). Also accepts names like 'wednesday', or 'thurs' */
  // dayOfWeek(value: number | string, goForward?: boolean): Spacetime;

  // /** get the day of the week as lower-case string */
  // dayName(): string;
  // /** set the day of the week */
  // dayName(value: string, goForward?: boolean): Spacetime;

  /** get whether the time is am or pm */
  ampm(): 'am' | 'pm';
  // /** set whether the time is am or pm */
  // ampm(value: 'am' | 'pm', goForward?: boolean): Spacetime;

  // /** get the current month as a string, like 'april' */
  // monthName(): string;
  // /** set the current month as a string, like 'april' */
  // monthName(value: string, goForward?: boolean): Spacetime;

  // /** returns the amount of days the current month has (December => 31, June => 30, ...) */
  // daysInMonth: () => number;
}

export interface TimezoneMeta {
  offset: number;
  display: string;
  name: string;
}

export interface Diff {
  days: number;
  hours: number;
  milliseconds: number;
  minutes: number;
  months: number;
  seconds: number;
  weeks: number;
  years: number;
}

export interface Since {
  diff: Diff;
  rounded: string;
  qualified: string;
  precise: string;
  abbreviated: string[];
  iso: string;
  direction: 'past' | 'present' | 'future';
}

/** set where the key is tz database name in lowercase, eg, 'america/denver' */
export interface TimezoneSet {
  [key: string]: {
    offset: number;
  };
}

export type ParsableDate = Spacetime | Date | number | Array<number> | string;

export interface Parser {
  reg: RegExp;
  parse: (s: Spacetime, m: RegExpMatchArray) => Spacetime;
}

export interface SpacetimeJson {
  year: number;
  /** zero-based month-number (0-11) */
  month: number;
  /** day-number of the month (1- max31) */
  date: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  /** offset in hours */
  offset: number;
  /** the timezone tz database name, eg, 'america/denver'  */
  timezone: string;
}
