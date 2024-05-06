/** Make a date with the UTC hours set to 0. Month is the actual month (not index). */
export function makeUtcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format a date as YYYY-MM-DD */
export function formatNumericDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Format a date as e.g. "22 March 2024" */
export function formatDate(date: Date, month: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month,
    day: '2-digit', // to match UCI format
    timeZone: 'UTC',
  });
}

/** Format date and time as e.g. "19 Mar 2024, 02:01 GMT" */
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
