import fetch from 'node-fetch';
import { parse, type HTMLElement as BasicHTMLElement } from 'node-html-parser';
import { getPcsUrl } from '../../common/getPcsUrl.js';
import type { BaseRider } from '../../common/types/index.js';
import { logWarning } from '../log.js';

/**
 * Get data from a rider's ProCyclingStats page for a given year.
 * Throws if there's an error fetching data.
 */
export async function loadPcsPage(params: { rider: BaseRider; year: number }): Promise<{
  pcsUrl: string;
  /** Race results table element */
  resultsTable: BasicHTMLElement;
  /** Totals row element */
  resultsSum: BasicHTMLElement;
  /** List of teams by year element */
  teamList: BasicHTMLElement;
}> {
  const { rider, year } = params;
  const pcsUrl = getPcsUrl({ name: rider.name, year });

  let root: BasicHTMLElement;
  try {
    let result = await fetch(pcsUrl);
    if (!result.ok) {
      if (result.status >= 500) {
        logWarning(`Retrying ${pcsUrl} after ${result.status} ${result.statusText}`);
        // wait 10s
        await new Promise((resolve) => setTimeout(resolve, 10000));
        result = await fetch(pcsUrl);
      }
    }
    if (!result.ok) {
      throw new Error(`Failed to load ${pcsUrl} - ${result.status} ${result.statusText}`);
    }
    root = parse(await result.text());
  } catch (err) {
    throw new Error(`Error loading or parsing ${pcsUrl} - ${(err as Error).message || err}`);
  }

  // This is usually the page title, or "Page not found" if the URL didn't work
  const h1Text = root.querySelector('h1')?.textContent.trim() || '';

  const nameParts = rider.name.toLowerCase().split(' ');
  const isNotFound =
    h1Text === 'Page not found' || !nameParts.some((word) => h1Text.toLowerCase().includes(word));
  if (isNotFound) {
    throw new Error(`Invalid PCS URL: ${pcsUrl}`);
  }

  // Race results
  const resultsTable = root.querySelector('.rdrResults');
  // Totals row
  const resultsSum = root.querySelector('.rdrResultsSum');
  // List of teams for each year
  const teamList = root.querySelector('.rdr-teams2');

  if (!(resultsTable && resultsSum && teamList)) {
    throw new Error(`PCS page format changed at ${pcsUrl}`);
  }

  return { pcsUrl, resultsTable, resultsSum, teamList };
}
