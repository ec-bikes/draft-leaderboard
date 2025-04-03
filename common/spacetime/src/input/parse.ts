import type { Spacetime } from '../../types/types.js';
import { parsers } from './formats/index.js';

/** Parse the input string and update the spacetime object */
export function setFromString(s: Spacetime, input: string) {
  //try each text-parse template, use the first good result
  for (const parser of parsers) {
    const m = input.match(parser.reg);
    if (m) {
      const res = parser.parse(s, m);
      if (res?.isValid()) {
        return res;
      }
    }
  }
  if (!s.silent) {
    console.warn(`Warning: couldn't parse date-string: '${input}'`);
  }
  s.epoch = null;
}
