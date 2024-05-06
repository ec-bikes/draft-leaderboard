import fetch from 'node-fetch';
import { parse, type HTMLElement as BasicHTMLElement } from 'node-html-parser';
import type { BaseRider } from '../../../common/types/Rider.js';
import { getPcsUrl } from '../../../common/getPcsUrl.js';

/**
 * Get data from a rider's ProCyclingStats page for a given year.
 * Throws if there's an error fetching data.
 *
 * (Right now this only returns the UCI points and sanctions totals. Race results could be added
 * if needed, but the format is more cmoplex.)
 */
export async function loadPcsPage(params: {
  rider: BaseRider;
  year: number;
}): Promise<{ pcsUrl: string; resultsTable: BasicHTMLElement; resultsSum: BasicHTMLElement }> {
  const { rider, year } = params;
  const pcsUrl = getPcsUrl({ name: rider.name, year });

  let root: BasicHTMLElement;
  try {
    const result = await fetch(pcsUrl);
    if (!result.ok) {
      throw new Error(`Failed to load ${pcsUrl} - ${result.status} ${result.statusText}`);
    }
    root = parse(await result.text());
  } catch (err) {
    throw new Error(`Error loading or parsing ${pcsUrl} - ${(err as Error).message || err}`);
  }

  // This is usually the page title, or "Page not found" if the URL didn't work
  const h1Text = root.querySelector('h1')?.textContent.trim() || '';
  // This is the race results (we're not parsing this right now)
  const resultsTable = root.querySelector('.rdrResults');
  // This is the totals row
  const resultsSum = root.querySelector('.rdrResultsSum');

  if (!resultsTable || !resultsSum) {
    const nameParts = rider.name.toLowerCase().split(' ');
    const isNotFound =
      h1Text === 'Page not found' || !nameParts.some((word) => h1Text.toLowerCase().includes(word));
    if (isNotFound) {
      throw new Error(`Invalid PCS URL: ${pcsUrl}`);
    }
    throw new Error(`PCS page format changed at ${pcsUrl}`);
  }

  return { pcsUrl, resultsTable, resultsSum };
}
