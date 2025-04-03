import quickOffset from './timezone/quick.js';
import { findTz } from './timezone/find.js';
import { setFromInput } from './input/index.js';
import zones from './zones.js';
import queryFns from './methods/query/index.js';
import addFns from './methods/add.js';
import sameFns from './methods/same.js';
import type { ParsableDate, Spacetime, TimezoneSet } from '../types/types.js';
import type { SpacetimeConstructorOptions } from '../types/constructors.js';
import { getEpoch } from './helpers.js';

let timezones = zones;

export class SpacetimeImpl implements Spacetime {
  get timezones(): TimezoneSet {
    return timezones;
  }
  set timezones(zones: TimezoneSet) {
    timezones = zones;
  }

  get tz() {
    return this._tz;
  }
  set tz(tz: string) {
    this._tz = findTz(tz, this.timezones);
  }

  epoch: number | null = null;
  readonly silent: boolean;
  readonly british: boolean;

  private _tz: string = '';
  // _today: unknown;

  constructor(input: ParsableDate, tz?: string, options: SpacetimeConstructorOptions = {}) {
    this.tz = findTz(tz, zones);
    this.silent = options.silent ?? true;
    this.british = !!options.dmy;

    // the reference today date object, (for testing)
    // this._today = {};
    // if (options.today !== undefined) {
    //   this._today = options.today;
    // }

    // parse the various formats
    setFromInput(this, input);
  }

  get d() {
    const offset = quickOffset(this);
    // every computer is somewhere- get this computer's built-in offset
    const bias = new Date(this.epoch || 0).getTimezoneOffset() || 0;
    // movement
    let shift = bias + offset * 60; //in minutes
    shift = shift * 60 * 1000; //in ms
    // remove this computer's offset
    const epoch = (this.epoch || 0) + shift;
    const d = new Date(epoch);
    return d;
  }

  isValid() {
    return this.epoch !== null && !isNaN(this.d.getTime());
  }

  clone() {
    return new SpacetimeImpl(this.epoch!, this.tz, {
      silent: this.silent,
      // today: this._today,
    });
  }

  toNativeDate() {
    return new Date(this.epoch!);
  }

  // toNativeLocalDate() {
  //   return this.d;
  // }

  offset() {
    return this.timezones[this.tz].offset;
  }

  millisecond() {
    return this.d.getMilliseconds();
  }

  second() {
    return this.d.getSeconds();
  }

  minute() {
    return this.d.getMinutes();
  }

  hour() {
    return this.d.getHours();
  }

  hour12() {
    return this.d.getHours() % 12 || 12;
  }

  ampm() {
    return this.hour() < 12 ? 'am' : 'pm';
  }

  isAfter(d: Spacetime | Date, isInclusive: boolean = false): boolean {
    const epoch = getEpoch(d);
    if (epoch === null || this.epoch === null) {
      return false;
    }
    return this.epoch > epoch || (isInclusive && this.epoch === epoch);
  }

  isBefore(d: Spacetime | Date, isInclusive: boolean = false) {
    const epoch = getEpoch(d);
    if (epoch === null || this.epoch === null) {
      return false;
    }
    return this.epoch < epoch || (isInclusive && this.epoch === epoch);
  }

  isEqual(d: Spacetime | Date) {
    const epoch = getEpoch(d);
    if (epoch === null || this.epoch === null) {
      return false;
    }
    return this.epoch === epoch;
  }

  isBetween(start: Spacetime | Date, end: Spacetime | Date, isInclusive = false) {
    return this.isAfter(start, isInclusive) && this.isBefore(end, isInclusive);
  }
}

// // (add instance methods to prototype)
// Object.keys(methods).forEach((k) => {
//   SpacetimeImpl.prototype[k] = methods[k];
// });

// // append more methods
// queryFns(SpacetimeImpl);
// addFns(SpacetimeImpl);
// sameFns(SpacetimeImpl);
