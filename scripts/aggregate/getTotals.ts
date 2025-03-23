import { utcDateFromString } from '../../common/formatDate.js';
import type { RiderDetails } from '../../common/types/Rider.js';

/**
 * Get the rider's total points, including results and sanctions, rounded to 2 decimal places.
 * (There can be fractional points from TTTs.)
 *
 * @param endDate - Only include results up to (including) this date.
 */
export function getRiderTotal(
  rider: Pick<RiderDetails, 'results' | 'sanctions'>,
  endDate?: Date,
): number {
  const { results, sanctions = 0 } = rider;
  const totalPoints = results.reduce(
    (total, result) =>
      !endDate || utcDateFromString(result.date) <= endDate ? total + result.points : total,
    0,
  );

  // Round last since silly JS float math also applies to subtraction
  return round2(totalPoints - sanctions);
}

/**
 * Get the team's total points, including results and sanctions, rounded to 2 decimal places.
 */
export function getTeamTotal(riders: Pick<RiderDetails, 'totalPoints'>[]): number {
  return round2(riders.reduce((total, rider) => total + rider.totalPoints, 0));
}

/** Round a number to max 2 decimal places */
function round2(x: number): number {
  return Number(`${Math.round(Number(`${x}e2`))}e-2`);
}
