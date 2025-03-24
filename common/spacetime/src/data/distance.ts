const past = 'past';
const future = 'future';
const present = 'present';
const now = 'now';
const almost = 'almost';
const over = 'over';
const pastDistance = (value) => `${value} ago`;
const futureDistance = (value) => `in ${value}`;

export function pastDistanceString(value) {
  return pastDistance(value);
}
export function futureDistanceString(value) {
  return futureDistance(value);
}
export function pastString() {
  return past;
}
export function futureString() {
  return future;
}
export function presentString() {
  return present;
}
export function nowString() {
  return now;
}
export function almostString() {
  return almost;
}
export function overString() {
  return over;
}
