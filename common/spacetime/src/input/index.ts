import type { ParsableDate, Spacetime, SpacetimeJson } from '../../types/types.js';
import { isObject, isDate } from '../helpers.js';
import { setFromArray, setFromObject, setFromNumber } from './helpers.js';
import { setFromString } from './parse.js';

//we have to actually parse these inputs ourselves
//  -  can't use built-in js parser ;(
//=========================================
// ISO Date	  "2015-03-25"
// Short Date	"03/25/2015" or "2015/03/25"
// Long Date	"Mar 25 2015" or "25 Mar 2015"
// Full Date	"Wednesday March 25 2015"
//=========================================

/** update the epoch from different input styles */
export function setFromInput(
  s: Spacetime,
  input: ParsableDate | Partial<SpacetimeJson> | null,
): void {
  // const today = s._today || defaults;
  //if we've been given a epoch number, it's easy
  if (typeof input === 'number') {
    setFromNumber(s, input);
    return;
  }

  //set tmp time
  s.epoch = Date.now();
  // // overwrite tmp time with 'today' value, if exists
  // if (s._today && isObject(s._today) && Object.keys(s._today).length > 0) {
  //   const res = parseObject(s, today);
  //   if (res.isValid()) {
  //     s.epoch = res.epoch;
  //   }
  // }

  if (!input) {
    // null input means 'now'
  } else if (isDate(input)) {
    //support input of Date() object
    s.epoch = input.getTime();
  } else if (Array.isArray(input)) {
    //support [2016, 03, 01] format
    // s = parseArray(s, input, today);
    setFromArray(s, input);
  } else if (isObject(input)) {
    if ((input as Spacetime).epoch) {
      //support spacetime object as input
      s.epoch = (input as Spacetime).epoch;
      s.tz = (input as Spacetime).tz;
    } else {
      //support {year:2016, month:3} format
      // const obj = Object.assign({}, input, today);
      setFromObject(s, input as Partial<SpacetimeJson>);
    }
  } else if (typeof input === 'string') {
    //little cleanup..
    input = normalizeDateInput(input);
    //try each text-parse template, use the first good result
    setFromString(s, input);
  }
}

function normalizeDateInput(str: string): string {
  // remove all day-names
  str = str.replace(/\b(mon|tues?|wed|wednes|thur?s?|fri|sat|satur|sun)(day)?\b/i, '');
  //remove ordinal ending
  str = str.replace(/([0-9])(th|rd|st|nd)/, '$1');
  str = str.replace(/,/g, '');
  str = str.replace(/ +/g, ' ').trim();
  return str;
}
