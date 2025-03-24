import quickOffset from './timezone/quick.js';
import { findTz } from './timezone/find.js';
import handleInput from './input/index.js';
import methods from './methods.js';
import zones from './zones.js';
import queryFns from './methods/query/index.js';
import addFns from './methods/add.js';
import sameFns from './methods/same.js';
import compareFns from './methods/compare.js';
import type { TimezoneSet } from 'spacetime';
import type { ParsableDate } from '../types/types.js';
import type { SpacetimeConstructorOptions } from '../types/constructors.js';
import { beADate, getEpoch } from './fns.js';

let timezones = zones;

export default class Spacetime {
  /** get the **global** tz database nameset  */
  get timezones(): TimezoneSet {
    return timezones;
  }
  /** set the **global** tz database nameset  */
  set timezones(zones: TimezoneSet) {
    timezones = zones;
  }

  /** epoch in milliseconds */
  epoch: number | null = null;
  /** the timezone tz database name, eg, 'america/denver'  */
  tz: string;
  /** whether warnings are enabled */
  silent: boolean;
  /** favour british interpretation of 02/02/2018, etc */
  british: boolean;
  // _today: unknown;

  constructor(input: ParsableDate, tz?: string, options: SpacetimeConstructorOptions = {}) {
    // the shift for the given timezone
    this.tz = findTz(tz, zones);
    // whether to output warnings to console
    this.silent = typeof options.silent !== 'undefined' ? options.silent : true;
    this.british = !!options.dmy;

    // the reference today date object, (for testing)
    // this._today = {};
    // if (options.today !== undefined) {
    //   this._today = options.today;
    // }

    // add getter/setters
    Object.defineProperty(this, 'd', {
      // return a js date object
      get: function () {
        const offset = quickOffset(this);
        // every computer is somewhere- get this computer's built-in offset
        const bias = new Date(this.epoch).getTimezoneOffset() || 0;
        // movement
        let shift = bias + offset * 60; //in minutes
        shift = shift * 60 * 1000; //in ms
        // remove this computer's offset
        const epoch = this.epoch + shift;
        const d = new Date(epoch);
        return d;
      },
    });

    // parse the various formats
    const tmp = handleInput(this, input);
    this.epoch = tmp.epoch;
    if (tmp.tz) {
      this.tz = tmp.tz;
    }
  }

  isValid() {
    //null/undefined epochs
    if (!this.epoch && this.epoch !== 0) {
      return false;
    }
    return !isNaN(this.d.getTime());
  }

  clone() {
    return new Spacetime(this.epoch!, this.tz, {
      silent: this.silent,
      // today: this._today,
    });
  }

  /**
   * @returns native date object at the same epoch
   */
  toNativeDate() {
    return new Date(this.epoch!);
  }

  isAfter(d, isInclusive = false) {
    d = beADate(d, this);
    const epoch = getEpoch(d);
    if (epoch === null || this.epoch === null) {
      return null;
    }
    return this.epoch > epoch || (isInclusive && this.epoch === epoch);
  }

  isBefore(d, isInclusive = false) {
    d = beADate(d, this);
    const epoch = getEpoch(d);
    if (epoch === null || this.epoch === null) {
      return null;
    }
    return this.epoch < epoch || (isInclusive && this.epoch === epoch);
  }

  isEqual(d) {
    d = beADate(d, this);
    const epoch = getEpoch(d);
    if (epoch === null || this.epoch === null) {
      return null;
    }
    return this.epoch === epoch;
  }

  isBetween(start, end, isInclusive = false) {
    return this.isAfter(start, isInclusive) && this.isBefore(end, isInclusive);
  }
}

// (add instance methods to prototype)
Object.keys(methods).forEach((k) => {
  Spacetime.prototype[k] = methods[k];
});

// append more methods
queryFns(Spacetime);
addFns(Spacetime);
sameFns(Spacetime);
compareFns(Spacetime);
