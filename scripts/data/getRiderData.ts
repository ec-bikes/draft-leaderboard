import { getSanctionsYear } from './getSanctionsYear';
import { getSanctions12Mo } from './getSanctions12Mo';
import type { RawRider } from '../types/RawTeam';
import type { Rider } from '../../src/types/Rider';
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

  console.log(`Getting data for ${name}...`);

  const sanctions12Mo = await getSanctions12Mo(rawRider);
  if (typeof sanctions12Mo === 'string') {
    issues.push(sanctions12Mo);
  } else if (sanctions12Mo) {
    rider.sanctions12Mo = sanctions12Mo;
    issues.push(`Sanctions (12-mo rolling): ${sanctions12Mo}`);
    console.log(`⚠️ Sanctions (12-mo rolling) for ${name}:`, rider.sanctions12Mo);
  }

  const sanctions2023 = await getSanctionsYear({ ...params, year: 2023 });
  if (typeof sanctions2023 === 'string') {
    issues.push(sanctions2023);
  } else if (sanctions2023 && (rider.sanctions12Mo || 0) > 0) {
    // only include old sanctions if they haven't fallen off already
    rider.sanctions2023 = sanctions2023;
    issues.push(`Sanctions (2023): ${sanctions2023}`);
    console.log(`⚠️ Sanctions (2023) for ${name}:`, rider.sanctions2023);
  }

  const riderResults = await getRiderResults(params);
  if (typeof riderResults === 'string') {
    issues.push(riderResults);
  } else {
    Object.assign(rider, riderResults);
  }

  return { rider, issues };
}
