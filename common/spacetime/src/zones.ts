import type { TimezoneSet } from '../types/types.js';

const utc = {
  offset: 0,
};
const all: TimezoneSet = {
  utc,
  gmt: utc,
};

// add gmt+n
for (let i = -14; i <= 14; i += 0.5) {
  all[`gmt${i > 0 ? '+' : ''}${i}`] = {
    offset: i * -1, // they're negative!
  };
}

export default all;
