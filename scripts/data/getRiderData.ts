import type { RawRider } from '../types/RawTeam.js';
import type { Group, RiderDetails } from '../../src/types/Rider.js';
import { getRiderPcsData } from './getRiderPcsData.js';
import { getRiderResults } from './getRiderResults.js';

/**
 * Get data for a rider.
 * Throws if there's an error fetching data.
 */
export async function getRiderData(params: {
  rider: RawRider;
  year: number;
  momentId: number;
  group: Group;
}): Promise<RiderDetails> {
  const { rider: rawRider } = params;
  const { name } = rawRider;
  const rider: RiderDetails = { name, id: rawRider.id, totalPoints: 0, results: [] };

  console.log(`Getting data for ${name}`);

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
