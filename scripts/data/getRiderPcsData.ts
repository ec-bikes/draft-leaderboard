import type { BaseRider, RiderDetails } from '../../common/types/index.js';
import { getPcsRiderResults } from './pcs/getPcsRiderResults.js';
import { getPcsRiderTotals } from './pcs/getPcsRiderTotals.js';
import { loadPcsPage } from './pcs/loadPcsPage.js';

/**
 * Get data from a rider's ProCyclingStats page for a given year.
 * Throws if there's an error fetching data.
 */
export async function getRiderPcsData(params: {
  rider: BaseRider;
  year: number;
}): Promise<Omit<RiderDetails, 'totalPoints'>> {
  const { rider, year } = params;

  console.log('Getting PCS data for ' + rider.name);

  const { pcsUrl, resultsTable, resultsSum } = await loadPcsPage(params);

  const { sanctions } = getPcsRiderTotals({ pcsUrl, resultsSum });

  const results = getPcsRiderResults({ pcsUrl, resultsTable, year });

  return {
    ...rider,
    sanctions,
    results,
  };
}
