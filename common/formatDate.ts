/* eslint-disable no-restricted-syntax -- this is the date helper file */

/** Make a date with the UTC hours set to 0. Month is the actual month (not index). */
export function makeUtcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

const isoDateRegex = /^\d\d\d\d-\d\d-\d\d$/;

/**
 * Convert a date string (probably no time) to a UTC date.
 * Works with formats like "YYYY-MM-DD" or "DD Mon YYYY".
 */
export function utcDateFromString(dateStr: string): Date {
  // YYYY-MM-DD is interpreted as UTC
  if (isoDateRegex.test(dateStr)) {
    return new Date(dateStr);
  }
  // Other dates are interpreted as local time.
  // Get only the date parts in local time, then make a UTC date.
  const localDate = new Date(dateStr);
  return makeUtcDate(localDate.getFullYear(), localDate.getMonth() + 1, localDate.getDate());
}

/** Format a date as YYYY-MM-DD in UTC time */
export function formatNumericDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Format a date as e.g. "22 Mar 2024" in UTC time*/
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit', // to match UCI format
    timeZone: 'UTC',
  });
}

/** Format date and time (UTC), e.g. "19 Mar 2024, 02:01 GMT" */
export function formatDateTime(date: Date): string {
  return (
    date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'UTC',
    }) + ' GMT'
  );
}
