import type { BaseRider, RiderDetails } from '../../common/types/Rider.js';
import type { Group } from '../../common/types/Group.js';
import { getRiderPcsData } from './getRiderPcsData.js';
import { getRiderResults } from './getRiderResults.js';

/**
 * Get data for a rider.
 * Throws if there's an error fetching data.
 */
export async function getRiderUciData(params: {
  rider: BaseRider;
  year: number;
  momentId: number;
  group: Group;
}): Promise<RiderDetails> {
  const rider: RiderDetails = { ...params.rider, totalPoints: 0, results: [] };

  console.log(`Getting UCI data for ${rider.name}`);

  // Get rider results from the UCI API
  const riderResults = await getRiderResults(params);
  rider.totalPoints = riderResults.totalPoints;
  rider.results = riderResults.results;

  // Get current year sanctions from PCS, because the only value I can find from the UCI is
  // 12-month rolling, which isn't useful here.
  const pcsData = await getRiderPcsData(params);
  rider.sanctions = pcsData.sanctions;
  rider.totalPoints -= rider.sanctions;

  return rider;
}
