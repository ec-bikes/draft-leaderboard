// javascript setX methods like setDate() can't be used because of the local bias
//these methods wrap around them.
import type { Spacetime } from '../../../types/types.js';
import { ms } from '../../data/milliseconds.js';
import { mapping } from '../../data/months.js';
import { clampDayInMonth, clampMonth } from '../../helpers.js';
import { walkTo } from './walk.js';

const months = mapping();

function ensureNumber(n: number | string) {
  return typeof n === 'number' ? n : parseInt(n, 10);
}

const order = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond'] as const;
export type SetValueUnit = (typeof order)[number];

/** reduce hostile micro-changes when moving dates by millisecond */
function confirm(s: Spacetime, tmp: Spacetime, unit: SetValueUnit) {
  const n = order.indexOf(unit);
  const arr = order.slice(n, order.length);
  for (let i = 0; i < arr.length; i++) {
    const want = tmp[arr[i]]();
    s = setValue(s, arr[i], want);
  }
  return s;
}

/** allow specifying setter direction */
function fwdBkwd(s: Spacetime, old: Spacetime, goFwd: boolean | undefined, unit: SetValueUnit) {
  if (goFwd === true && s.isBefore(old)) {
    s = s.add(1, unit);
  } else if (goFwd === false && s.isAfter(old)) {
    s = s.subtract(1, unit);
  }
  return s;
}

const fns: Record<
  SetValueUnit,
  (old: Spacetime, s: Spacetime, n: number, goFwd?: boolean) => Spacetime
> = {
  millisecond: (old, s, n) => {
    const current = s.millisecond();
    s.epoch! -= current - n;
    return s;
  },

  second: (old, s, n, goFwd) => {
    const diff = s.second() - n;
    const shift = diff * ms.second;
    s.epoch! -= shift;
    s = fwdBkwd(s, old, goFwd, 'minute'); // specify direction
    return s;
  },

  minute: (old, s, n, goFwd) => {
    const diff = s.minute() - n;
    s.epoch! -= diff * ms.minute;
    confirm(s, old, 'second');
    s = fwdBkwd(s, old, goFwd, 'hour'); // specify direction
    return s;
  },

  hour: (old, s, n, goFwd) => {
    n = Math.min(23, Math.max(0, n));
    let diff = s.hour() - n;
    let shift = diff * ms.hour;
    s.epoch! -= shift;
    // oops, did we change the day?
    if (s.date() !== old.date()) {
      s = old.clone();
      if (diff > 1) {
        diff -= 1;
      } else if (diff < 1) {
        diff += 1;
      }
      shift = diff * ms.hour;
      s.epoch! -= shift;
    }
    walkTo(s, {
      hour: n,
    });
    confirm(s, old, 'minute');
    s = fwdBkwd(s, old, goFwd, 'date'); // specify direction
    return s;
  },

  date: (old, s, n, goFwd) => {
    n = clampDayInMonth({ month: s.month(), year: s.year(), date: n });
    walkTo(s, {
      date: n,
    });
    s = fwdBkwd(s, old, goFwd, 'month'); // specify direction
    return s;
  },

  month: (old, s, n, goFwd) => {
    n = clampMonth(ensureNumber(n));

    walkTo(s, {
      month: n,
      d: clampDayInMonth({ month: n, year: s.year(), date: s.date() }),
    });
    s = fwdBkwd(s, old, goFwd, 'year'); // specify direction
    return s;
  },

  year: (old, s, n) => {
    walkTo(s, { year: n });
    return s;
  },
};

/** Set the unit value in a **new** spacetime object */
export function setValue(s: Spacetime, unit: SetValueUnit, n: number | string, goFwd?: boolean) {
  if (unit === 'month' && typeof n === 'string') {
    if (n === 'sept') {
      n = 'sep';
    }
    n = (months as Record<string, number | undefined>)[n.toLowerCase()] || 0;
  }
  if (typeof n === 'string') {
    n = parseInt(n, 10);
  }

  return fns[unit](s, s.clone(), n, goFwd);
}
