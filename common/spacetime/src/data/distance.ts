let past = 'past'
let future = 'future'
let present = 'present'
let now = 'now'
let almost = 'almost'
let over = 'over'
let pastDistance = (value) => `${value} ago`
let futureDistance = (value) => `in ${value}`

export function pastDistanceString(value) { return pastDistance(value) }
export function futureDistanceString(value) { return futureDistance(value) }
export function pastString() { return past }
export function futureString() { return future }
export function presentString() { return present }
export function nowString() { return now }
export function almostString() { return almost }
export function overString() { return over }