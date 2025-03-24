import { milliseconds, seconds, minutes, hours, time as _time } from '../set/set.js';
import { am, pm } from '../../data/ampm.js';
import { zeroPad } from '../../helpers.js';

const methods = {
  millisecond: function (num) {
    if (num !== undefined) {
      const s = this.clone();
      s.epoch = milliseconds(s, num);
      return s;
    }
    return this.d.getMilliseconds();
  },
  second: function (num, goFwd) {
    if (num !== undefined) {
      const s = this.clone();
      s.epoch = seconds(s, num, goFwd);
      return s;
    }
    return this.d.getSeconds();
  },
  minute: function (num, goFwd) {
    if (num !== undefined) {
      const s = this.clone();
      s.epoch = minutes(s, num, goFwd);
      return s;
    }
    return this.d.getMinutes();
  },
  hour: function (num, goFwd) {
    const d = this.d;
    if (num !== undefined) {
      const s = this.clone();
      s.epoch = hours(s, num, goFwd);
      return s;
    }
    return d.getHours();
  },

  // hour in 12h format
  hour12: function (str, goFwd) {
    const d = this.d;
    if (str !== undefined) {
      const s = this.clone();
      str = '' + str;
      const m = str.match(/^([0-9]+)(am|pm)$/);
      if (m) {
        let hour = parseInt(m[1], 10);
        if (m[2] === 'pm') {
          hour += 12;
        }
        s.epoch = hours(s, hour, goFwd);
      }
      return s;
    }
    //get the hour
    let hour12 = d.getHours();
    if (hour12 > 12) {
      hour12 = hour12 - 12;
    }
    if (hour12 === 0) {
      hour12 = 12;
    }
    return hour12;
  },

  //some ambiguity here with 12/24h
  time: function (str, goFwd) {
    if (str !== undefined) {
      const s = this.clone();
      str = str.toLowerCase().trim();
      s.epoch = _time(s, str, goFwd);
      return s;
    }
    return `${this.h12()}:${zeroPad(this.minute())}${this.ampm()}`;
  },

  // either 'am' or 'pm'
  ampm: function (input, goFwd) {
    // let which = 'am'
    let which = am();
    let hour = this.hour();
    if (hour >= 12) {
      // which = 'pm'
      which = pm();
    }
    if (typeof input !== 'string') {
      return which;
    }
    //okay, we're doing a setter
    const s = this.clone();
    input = input.toLowerCase().trim();
    //ampm should never change the day
    // - so use `.hour(n)` instead of `.minus(12,'hour')`
    if (hour >= 12 && input === 'am') {
      //noon is 12pm
      hour -= 12;
      return s.hour(hour, goFwd);
    }
    if (hour < 12 && input === 'pm') {
      hour += 12;
      return s.hour(hour, goFwd);
    }
    return s;
  },

  //parse a proper iso string
  iso: function (num) {
    if (num !== undefined) {
      return this.set(num);
    }
    return this.format('iso');
  },
};
export default methods;
