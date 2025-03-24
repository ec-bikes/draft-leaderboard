const day = 8.64e7
let o = {
  millisecond: 1,
  second: 1000,
  minute: 60000,
  hour: 3.6e6, // dst is supported post-hoc
  day,
  date: day,
  month: day * 29.5, //(average)
  week: 6.048e8,
  year: 3.154e10 // leap-years are supported post-hoc
}
//add plurals
Object.keys(o).forEach(k => {
  o[k + 's'] = o[k]
})
export default o
