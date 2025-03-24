 
import { week as setWeek, month as _month, year as _year } from '../set/set.js'
import { long } from '../../data/months.js'
import ms from '../../data/milliseconds.js'

const clearMinutes = (s) => {
  s = s.minute(0)
  s = s.second(0)
  s = s.millisecond(1)
  return s
}

const methods = {

  //since the start of the year
  week: function (num, goFwd) {
    // week-setter
    if (num !== undefined) {
      let s = this.clone()
      s = setWeek(s, num, goFwd)
      s = clearMinutes(s)
      return s
    }
    //find-out which week it is:
    const thisOne = this.epoch
    let tmp = this.clone()

    // first - are we in week 1 of the next year?
    if (tmp.monthName() === 'december' && tmp.date() >= 29) {
      let startNext = setWeek(tmp.add(15, 'days'), 1, false)
      if (startNext.epoch <= tmp.epoch) {
        return 1
      }
    }
    // Ok, calculate which week we're in:
    // go to the first week of the year
    tmp = tmp.month(0) // go to jan 1
    tmp = tmp.date(1)
    tmp = clearMinutes(tmp)
    tmp = tmp.day('monday', false) // go backward to monday
    if (tmp.monthName() === 'december' && tmp.date() < 29) {
      tmp = tmp.add(1, 'week')
    }

    tmp = tmp.minus(2, 'hours') // fudge for any DST
    //if the week technically hasn't started yet
    if (tmp.epoch > thisOne) {
      return 1
    }
    //speed it up, if we can
    let i = 0
    let skipWeeks = this.month() * 4
    tmp.epoch += ms.week * skipWeeks
    i += skipWeeks
    for (; i <= 52; i++) {
      if (tmp.epoch > thisOne) {
        return i
      }
      tmp = tmp.add(1, 'week')
    }
    return 52
  },
  //either name or number
  month: function (input, goFwd) {
    if (input !== undefined) {
      let s = this.clone()
      s.epoch = _month(s, input, goFwd)
      return s
    }
    return this.d.getMonth()
  },
  //'january'
  monthName: function (input, goFwd) {
    if (input !== undefined) {
      let s = this.clone()
      s = s.month(input, goFwd)
      return s
    }
    return long()[this.month()]
  },

  //the year number
  year: function (num) {
    if (num !== undefined) {
      let s = this.clone()
      s.epoch = _year(s, num)
      return s
    }
    return this.d.getFullYear()
  }
}
export default methods
