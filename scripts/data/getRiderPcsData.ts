import type { BaseRider, RiderDetails } from '../../common/types/Rider.js';
import { loadPcsPage } from './pcs/loadPcsPage.js';
import { getPcsRiderTotals } from './pcs/getPcsRiderTotals.js';
import { getPcsRiderResults } from './pcs/getPcsRiderResults.js';

/**
 * Get data from a rider's ProCyclingStats page for a given year.
 * Throws if there's an error fetching data.
 *
 * (Right now this only returns the UCI points and sanctions totals. Race results could be added
 * if needed, but the format is more cmoplex.)
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
