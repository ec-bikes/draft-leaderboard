import type { BaseRider, Group, RiderDetails } from '../../common/types/index.js';
import { getUciRiderResults } from './getUciRiderResults.js';

/**
 * Get data for a rider. Mostly uses UCI data, but also gets PCS data for sanctions.
 * Throws if there's an error fetching data.
 */
export async function getUciRiderData(params: {
  rider: BaseRider;
  year: number;
  momentId: number;
  group: Group;
  /**
   * The UCI API only includes 12-month rolling sanctions, so this must be calculated from the
   * PCS API and passed in...
   */
  sanctions: number | undefined;
}): Promise<Omit<RiderDetails, 'totalPoints'>> {
  const rider: Omit<RiderDetails, 'totalPoints'> = { ...params.rider, results: [] };

  console.log(`Getting UCI data for ${rider.name}`);

  // Get rider results from the UCI API
  rider.results = await getUciRiderResults(params);

  rider.sanctions = params.sanctions;

  return rider;
}
