const shortMonths = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;
const longMonths = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export function short() {
  return shortMonths;
}
export function long() {
  return longMonths;
}
export function mapping() {
  const obj = {
    sep: 8, //support this format
  } as Record<(typeof shortMonths)[number] | (typeof longMonths)[number], number>;

  for (let i = 0; i < shortMonths.length; i++) {
    obj[shortMonths[i]] = i;
  }
  for (let i = 0; i < longMonths.length; i++) {
    obj[longMonths[i]] = i;
  }
  return obj;
}
