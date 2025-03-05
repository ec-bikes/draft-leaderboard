import type { BaseRider, RiderDetails } from '../../common/types/index.js';
import { parsePcsRiderResults } from '../pcs/parsePcsRiderResults.js';
import { parsePcsRiderTotals } from '../pcs/parsePcsRiderTotals.js';
import { loadPcsPage } from '../pcs/loadPcsPage.js';

/**
 * Get data from a rider's ProCyclingStats page for a given year.
 * Throws if there's an error fetching data.
 */
export async function getPcsRiderData(params: {
  rider: BaseRider;
  year: number;
}): Promise<Omit<RiderDetails, 'totalPoints'>> {
  const { rider, year } = params;

  console.log('Getting PCS data for ' + rider.name);

  const { pcsUrl, resultsTable, resultsSum } = await loadPcsPage(params);

  const { sanctions } = parsePcsRiderTotals({ pcsUrl, resultsSum });

  const results = parsePcsRiderResults({ pcsUrl, resultsTable, year });

  return {
    ...rider,
    sanctions,
    results,
  };
}
