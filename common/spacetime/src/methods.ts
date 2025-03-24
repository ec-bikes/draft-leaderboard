 
import format from './methods/format/index.js';
import unixFmt from './methods/format/unixFmt.js';
import diff from './methods/diff/index.js';
import { startOf as _startOf, endOf as _endOf } from './methods/startOf.js';
import timezone from './timezone/index.js';
import findTz from './timezone/find.js';
import handleInput from './input/index.js';
import { isLeapYear } from './fns.js';
const units = ['year', 'month', 'date', 'day', 'hour', 'minute', 'second', 'millisecond'];

//the spacetime instance methods (also, the API)
const methods = {
  set: function (input, tz) {
    let s = this.clone();
    s = handleInput(s, input, null);
    if (tz) {
      s.tz = findTz(tz, s.timezones);
    }
    return s;
  },
  timezone: function (tz) {
    // hot-swap the timezone, to avoid time-change
    if (tz !== undefined) {
      const json = this.json();
      json.timezone = tz;
      return this.set(json, tz);
    }
    return timezone(this);
  },
  offset: function () {
    return timezone(this).offset * 60;
  },
  format: function (fmt) {
    return format(this, fmt);
  },
  unixFmt: function (fmt) {
    return unixFmt(this, fmt);
  },
  startOf: function (unit) {
    return _startOf(this, unit);
  },
  endOf: function (unit) {
    return _endOf(this, unit);
  },
  leapYear: function () {
    const year = this.year();
    return isLeapYear(year);
  },
  diff: function (d, unit) {
    return diff(this, d, unit);
  },
  //travel to this timezone
  goto: function (tz) {
    const s = this.clone();
    s.tz = findTz(tz, s.timezones); //science!
    return s;
  },
  daysInMonth: function () {
    const month = this.month() + 1;
    if (month === 2) {
      return this.leapYear() ? 29 : 28;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      return 30;
    }
    return 31;
  },
  json: function (input) {
    // setter for json input
    if (input !== undefined) {
      let s = this.clone();
      if (input.timezone) {
        s.tz = input.timezone;
      }
      for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (input[unit] !== undefined) {
          s = s[unit](input[unit]);
        }
      }
      return s;
    }
    // produce json output
    const obj = units.reduce((h, unit) => {
      h[unit] = this[unit]();
      return h;
    }, {});
    obj.offset = this.timezone().offset;
    obj.timezone = this.tz;
    return obj;
  },
  debug: function () {
    const tz = this.timezone();
    let date = this.format('MM') + ' ' + this.format('date') + ' ' + this.year();
    date += '\n     - ' + this.format('time');
    console.log('\n\n', date + '\n     - ' + tz.name + ' (' + tz.offset + ')');
    return this;
  },
};
// aliases
export default methods;
