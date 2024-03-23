/** Format a date as YYYY-MM-DD */
export function formatNumericDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Format a date as e.g. "22 March 2024" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
