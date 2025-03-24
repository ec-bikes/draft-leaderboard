import { formatTimezone } from '../../helpers.js';

// create the timezone offset part of an iso timestamp
// it's kind of nuts how involved this is
// "+01:00", "+0100", or simply "+01"
const isoOffset = (s) => {
  const offset = s.timezone().offset;
  return !offset ? 'Z' : formatTimezone(offset, ':');
};

export default isoOffset;
