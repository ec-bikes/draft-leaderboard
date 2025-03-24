const isOffset = /(-?[0-9]+)h(rs)?/i;
const isNumber = /(-?[0-9]+)/;
const utcOffset = /utc([-+]?[0-9]+)/i;
const gmtOffset = /gmt([-+]?[0-9]+)/i;

function toIana(num: string | number) {
  num = Number(num);
  if (num >= -13 && num <= 13) {
    num = num * -1; //it's opposite!
    return `gmt${num > 0 ? '+' : ''}${num}`;
  }
  return null;
}

export function parseOffset(tz: string) {
  // '+5hrs'
  let m = tz.match(isOffset);
  if (m !== null) {
    return toIana(m[1]);
  }
  // 'utc+5'
  m = tz.match(utcOffset);
  if (m !== null) {
    return toIana(m[1]);
  }
  // 'GMT-5' (not opposite)
  m = tz.match(gmtOffset);
  if (m !== null) {
    const num = Number(m[1]) * -1;
    return toIana(num);
  }
  // '+5'
  m = tz.match(isNumber);
  if (m !== null) {
    return toIana(m[1]);
  }
  return null;
}
