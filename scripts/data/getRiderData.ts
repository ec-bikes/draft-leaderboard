import type { RawRider } from '../types/RawTeam';
import type { Rider } from '../../src/types/Rider';
import { getRiderPcsData } from './getRiderPcsData';
import { getRiderResults } from './getRiderResults';

/**
 * Get data for a rider, and a list of any possible issues encountered.
 */
export async function getRiderData(params: {
  rider: RawRider;
  momentId: number;
}): Promise<{ rider: Rider; issues: string[] }> {
  const { rider: rawRider } = params;
  const { name } = rawRider;
  const rider: Rider = { name };
  const issues: string[] = [];

  console.log(`Getting data for ${name}`);

  // Get rider results from the UCI API
  const riderResults = await getRiderResults(params);
  if (typeof riderResults === 'string') {
    issues.push(riderResults);
  } else {
    Object.assign(rider, riderResults);
  }

  // Get current year sanctions from PCS, because the only value I can find from the UCI is
  // 12-month rolling, which isn't useful here.
  const pcsData = await getRiderPcsData({ ...params, year: 2024 });
  if (typeof pcsData === 'string') {
    issues.push(pcsData);
  } else if (pcsData.sanctions) {
    rider.sanctions = pcsData.sanctions;
    console.log(`⚠️ Sanctions for ${name}:`, rider.sanctions);
    if (rider.totalPoints !== undefined) {
      rider.totalPoints -= rider.sanctions;
    }
  }

  return { rider, issues };
}
