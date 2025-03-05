import type { Group } from '../common/types/index.js';
import { mensRidersLower } from './mensRiders.js';
import { womensRidersLower } from './womensRiders.js';

/** Get the UCI object ID for a rider name. */
export function getRiderId(name: string, group: Group): number | undefined {
  const riders = group === 'women' ? womensRidersLower : mensRidersLower;
  return riders[name.toLowerCase()];
}
