import walkTo from './set/walk.js'
import { normalize } from '../fns.js'

const units = {
  second: (s) => {
    walkTo(s, {
      millisecond: 0
    })
    return s
  },
  minute: (s) => {
    walkTo(s, {
      second: 0,
      millisecond: 0
    })
    return s
  },
  hour: (s) => {
    walkTo(s, {
      minute: 0,
      second: 0,
      millisecond: 0
    })
    return s
  },
  day: (s) => {
    walkTo(s, {
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    return s
  },
  week: (s) => {
    let original = s.clone()
    s = s.day(1) //monday
    if (s.isAfter(original)) {
      s = s.subtract(1, 'week')
    }
    walkTo(s, {
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    return s
  },
  month: (s) => {
    walkTo(s, {
      date: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    return s
  },
  year: (s) => {
    walkTo(s, {
      month: 0,
      date: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    })
    return s
  }
}
units.date = units.day

const startOf = (a, unit) => {
  let s = a.clone()
  unit = normalize(unit)
  if (units[unit]) {
    return units[unit](s)
  }
  return s
}

//piggy-backs off startOf
const endOf = (a, unit) => {
  let s = a.clone()
  unit = normalize(unit)
  if (units[unit]) {
    // go to beginning, go to next one, step back 1ms
    s = units[unit](s) // startof
    s = s.add(1, unit)
    s = s.subtract(1, 'millisecond')
    return s
  }
  return s
}
export {
  startOf,
  endOf
}
