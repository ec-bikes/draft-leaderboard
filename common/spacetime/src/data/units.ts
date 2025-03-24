const units = {
  second: 'second',
  seconds: 'seconds',
  minute: 'minute',
  minutes: 'minutes',
  hour: 'hour',
  hours: 'hours',
  day: 'day',
  days: 'days',
  month: 'month',
  months: 'months',
  year: 'year',
  years: 'years',
};

export function unitsString(unit) {
  return units[unit] || '';
}
