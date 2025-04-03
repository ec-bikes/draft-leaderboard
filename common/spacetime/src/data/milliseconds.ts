const day = 8.64e7;
export const ms = {
  millisecond: 1,
  milliseconds: 1,
  second: 1000,
  seconds: 1000,
  minute: 60000,
  minutes: 60000,
  hour: 3.6e6, // dst is supported post-hoc
  hours: 3.6e6,
  day,
  days: day,
  date: day,
  dates: day,
  month: day * 29.5, //(average)
  months: day * 29.5,
  week: 6.048e8,
  weeks: 6.048e8,
  year: 3.154e10, // leap-years are supported post-hoc
  years: 3.154e10,
};
