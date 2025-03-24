import walkTo from './set/walk.js'
import ms from '../data/milliseconds.js'
import monthLength from '../data/monthLengths.js'
import { months, daysBack, days } from './set/_model.js'
import { normalize } from '../fns.js'
// this logic is a bit of a mess,
// but briefly:
// millisecond-math, and some post-processing covers most-things
// we 'model' the calendar here only a little bit
// and that usually works-out...

const order = ['millisecond', 'second', 'minute', 'hour', 'date', 'month']
let keep = {
  second: order.slice(0, 1),
  minute: order.slice(0, 2),
  hour: order.slice(0, 3),
  date: order.slice(0, 4),
  month: order.slice(0, 4),
  year: order,
}
keep.week = keep.hour

const keepDate = {
  month: true,
  year: true
}

const addMethods = (SpaceTime) => {
  SpaceTime.prototype.add = function (num, unit) {
    let s = this.clone()

    if (!unit || num === 0) {
      return s //don't bother
    }
    let old = this.clone()
    unit = normalize(unit)
    if (unit === 'millisecond') {
      s.epoch += num
      return s
    }
    //move forward by the estimated milliseconds (rough)
    if (ms[unit]) {
      s.epoch += ms[unit] * num
    } else if (unit === 'week') {
      s.epoch += ms.day * (num * 7)
    }
    //now ensure our milliseconds/etc are in-line
    let want = {}
    if (keep[unit]) {
      keep[unit].forEach((u) => {
        want[u] = old[u]()
      })
    }

    //ensure month/year has ticked-over
    if (unit === 'month') {
      want.month = old.month() + num
      //month is the one unit we 'model' directly
      want = months(want, old)
    }
    //support coercing a week, too
    if (unit === 'week') {
      let sum = old.date() + (num * 7)
      if (sum <= 28 && sum > 1) {
        want.date = sum
      }
    }
    //support 25-hour day-changes on dst-changes
    else if (unit === 'date') {
      if (num < 0) {
        want = daysBack(want, old, num)
      } else {
        //specify a naive date number, if it's easy to do...
        let sum = old.date() + num
        // ok, model this one too
        want = days(want, old, sum)
      }
      //manually punt it if we haven't moved at all..
      if (num !== 0 && old.isSame(s, 'day')) {
        want.date = old.date() + num
      }
    }
    //ensure year has changed (leap-years)
    else if (unit === 'year') {
      let wantYear = old.year() + num
      let haveYear = s.year()
      if (haveYear < wantYear) {
        let toAdd = Math.floor(num / 4) || 1 //approx num of leap-days
        s.epoch += Math.abs(ms.day * toAdd)
      } else if (haveYear > wantYear) {
        let toAdd = Math.floor(num / 4) || 1 //approx num of leap-days
        s.epoch += ms.day * toAdd
      }
    }
    //keep current date, unless the month doesn't have it.
    if (keepDate[unit]) {
      let max = monthLength[want.month]
      want.date = old.date()
      if (want.date > max) {
        want.date = max
      }
    }
    if (Object.keys(want).length > 1) {
      walkTo(s, want)
    }
    return s
  }

  //subtract is only add *-1
  SpaceTime.prototype.subtract = function (num, unit) {
    let s = this.clone()
    return s.add(num * -1, unit)
  }
  //add aliases
  SpaceTime.prototype.minus = SpaceTime.prototype.subtract
  SpaceTime.prototype.plus = SpaceTime.prototype.add
}

export default addMethods
