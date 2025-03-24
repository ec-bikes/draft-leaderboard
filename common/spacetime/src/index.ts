import Spacetime from './spacetime.js';

const main = (input, tz, options) => new Spacetime(input, tz, options);

// set all properties of a given 'today' object
const setToday = function (s) {
  const today = s._today || {};
  Object.keys(today).forEach((k) => {
    s = s[k](today[k]);
  });
  return s;
};

//some helper functions on the main method
export const now = (tz, options) => {
  let s = new Spacetime(new Date().getTime(), tz, options);
  s = setToday(s);
  return s;
};
export const today = (tz, options) => {
  let s = new Spacetime(new Date().getTime(), tz, options);
  s = setToday(s);
  return s.startOf('day');
};
export const tomorrow = (tz, options) => {
  let s = new Spacetime(new Date().getTime(), tz, options);
  s = setToday(s);
  return s.add(1, 'day').startOf('day');
};
export const yesterday = (tz, options) => {
  let s = new Spacetime(new Date().getTime(), tz, options);
  s = setToday(s);
  return s.subtract(1, 'day').startOf('day');
};
export const timezones = function () {
  const s = new Spacetime();
  return s.timezones;
};
export const max = function (tz, options) {
  const s = new Spacetime(null, tz, options);
  s.epoch = 8640000000000000;
  return s;
};
export const min = function (tz, options) {
  const s = new Spacetime(null, tz, options);
  s.epoch = -8640000000000000;
  return s;
};

//aliases:
export default main;
