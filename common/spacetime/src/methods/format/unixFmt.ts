import { formatTimezone, zeroPad as pad } from '../../fns.js'
//parse this insane unix-time-templating thing, from the 19th century
//http://unicode.org/reports/tr35/tr35-25.html#Date_Format_Patterns

//time-symbols we support
const mapping = {
  //year
  y: (s) => s.year(),
  //last two chars
  yy: (s) => pad(Number(String(s.year()).slice(2, 4))),
  yyy: (s) => s.year(),
  yyyy: (s) => s.year(),
  yyyyy: (s) => '0' + s.year(),

  //month
  M: (s) => s.month() + 1,
  MM: (s) => pad(s.month() + 1),
  MMM: (s) => s.format('month-short'),
  MMMM: (s) => s.format('month'),

  //week
  w: (s) => s.week(),
  ww: (s) => pad(s.week()),

  //date of month
  d: (s) => s.date(),
  dd: (s) => pad(s.date()),

  //day
  E: (s) => s.format('day-short'),
  EE: (s) => mapping.E(s),
  EEE: (s) => mapping.E(s),
  EEEE: (s) => s.format('day'),
  EEEEE: (s) => s.format('day')[0],
  e: (s) => s.day(),
  ee: (s) => s.day(),
  eee: (s) => mapping.E(s),
  eeee: (s) => s.format('day'),
  eeeee: (s) => s.format('day')[0],

  //am/pm
  a: (s) => s.ampm().toUpperCase(),

  //hour
  h: (s) => s.h12(),
  hh: (s) => pad(s.h12()),
  H: (s) => s.hour(),
  HH: (s) => pad(s.hour()),

  m: (s) => s.minute(),
  mm: (s) => pad(s.minute()),
  s: (s) => s.second(),
  ss: (s) => pad(s.second()),

  //milliseconds
  SSS: (s) => pad(s.millisecond(), 3),
  //timezone
  z: (s) => s.timezone().name,
  Z: (s) => formatTimezone(s.timezone().offset),
  ZZZZ: (s) => formatTimezone(s.timezone().offset, ':')
}

const addAlias = (char, to, n) => {
  let name = char
  let toName = to
  for (let i = 0; i < n; i += 1) {
    mapping[name] = mapping[toName]
    name += char
    toName += to
  }
}
addAlias('Y', 'y', 4)
addAlias('S', 's', 2)

// support unix-style escaping with ' character
const escapeChars = function (arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === `'`) {
      // greedy-search for next apostrophe
      for (let o = i + 1; o < arr.length; o += 1) {
        if (arr[o]) {
          arr[i] += arr[o]
        }
        if (arr[o] === `'`) {
          arr[o] = null
          break
        }
        arr[o] = null
      }
    }
  }
  return arr.filter((ch) => ch)
}

//combine consecutive chars, like 'yyyy' as one.
const combineRepeated = function (arr) {
  for (let i = 0; i < arr.length; i += 1) {
    let c = arr[i]
    // greedy-forward
    for (let o = i + 1; o < arr.length; o += 1) {
      if (arr[o] === c) {
        arr[i] += arr[o]
        arr[o] = null
      } else {
        break
      }
    }
  }
  // '' means one apostrophe
  arr = arr.filter((ch) => ch)
  arr = arr.map((str) => {
    if (str === `''`) {
      str = `'`
    }
    return str
  })
  return arr
}

const unixFmt = (s, str) => {
  let arr = str.split('')
  // support character escaping
  arr = escapeChars(arr)
  //combine 'yyyy' as string.
  arr = combineRepeated(arr)
  return arr.reduce((txt, c) => {
    if (mapping[c] !== undefined) {
      txt += mapping[c](s) || ''
    } else {
      // 'unescape'
      if (/^'.+'$/.test(c)) {
        c = c.replace(/'/g, '')
      }
      txt += c
    }
    return txt
  }, '')
}
export default unixFmt
