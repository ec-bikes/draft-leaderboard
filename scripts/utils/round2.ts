/** Round a number to max 2 decimal places */
export function round2(x: number): number {
  return Number(`${Math.round(Number(`${x}e2`))}e-2`);
}
