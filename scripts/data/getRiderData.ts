import type { RawRider } from '../types/RawTeam';
import type { RiderDetails } from '../../src/types/Rider';
import { getRiderPcsData } from './getRiderPcsData';
import { getRiderResults } from './getRiderResults';

/**
 * Get data for a rider, and a list of any possible issues encountered.
 */
export async function getRiderData(params: {
  rider: RawRider;
  year: number;
  momentId: number;
}): Promise<{ rider: RiderDetails; issues: string[] }> {
  const { rider: rawRider } = params;
  const { name } = rawRider;
  const rider: RiderDetails = { name, id: rawRider.id, totalPoints: 0, results: [] };
  const issues: string[] = [];

  console.log(`Getting data for ${name}`);

  // Get rider results from the UCI API
  const riderResults = await getRiderResults(params);
  if (typeof riderResults === 'string') {
    issues.push(riderResults);
  } else {
    rider.totalPoints = riderResults.totalPoints;
    rider.results = riderResults.results;
  }

  // Get current year sanctions from PCS, because the only value I can find from the UCI is
  // 12-month rolling, which isn't useful here.
  const pcsData = await getRiderPcsData(params);
  if (typeof pcsData === 'string') {
    issues.push(pcsData);
  } else if (pcsData.sanctions) {
    rider.sanctions = pcsData.sanctions;
    console.log(`⚠️ Sanctions for ${name}:`, rider.sanctions);
    rider.totalPoints -= rider.sanctions;
  }

  return { rider, issues };
}
