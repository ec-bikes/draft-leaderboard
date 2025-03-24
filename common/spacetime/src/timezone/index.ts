import findTz from './find.js';

//iana codes are case-sensitive, technically
const titleCase = (str) => {
  str = str[0].toUpperCase() + str.substr(1);
  str = str.replace(/[/_-]([a-z])/gi, (s) => {
    return s.toUpperCase();
  });
  str = str.replace(/^gmt/i, 'GMT');
  if (str === 'Utc') {
    str = 'UTC';
  }
  return str;
};

//get metadata about this timezone
const timezone = (s) => {
  const zones = s.timezones;
  let tz = s.tz;
  if (zones.hasOwnProperty(tz) === false) {
    tz = findTz(s.tz, zones);
  }
  if (tz === null) {
    if (s.silent === false) {
      console.warn(`Warn: could not find given or local timezone - '${s.tz}'`);
    }
    return { offset: 0 };
  }
  const found = zones[tz];
  const result = {
    name: titleCase(tz),
    offset: found.offset,
  };

  return result;
};
export default timezone;
