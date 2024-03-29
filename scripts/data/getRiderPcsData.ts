import fetch from 'node-fetch';
import { parse, type HTMLElement as BasicHTMLElement } from 'node-html-parser';
import type { BaseRider } from '../../common/types/Rider.js';
import { getPcsUrl } from '../../common/getPcsUrl.js';

/**
 * Get data from a rider's ProCyclingStats page for a given year.
 * Throws if there's an error fetching data.
 *
 * Note that the UCI points appear *not* to include WWT leader's jersey bonuses.
 *
 * (Right now this only returns the UCI points and sanctions totals. Race results could be added
 * if needed, but the format is more cmoplex.)
 */
export async function getRiderPcsData(params: {
  rider: BaseRider;
  year: number;
}): Promise<{ uciPoints: number; sanctions: number }> {
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

  // Totals row is like this. The UCI points should always be there (even if 0).
  // Penalties will only be present if applicable.
  //   <div class="rdrResultsSum">
  //     <div>5290 km in <b>47</b> days | PCS points: <b>3602</b> | UCI points: <b>6011.86</b> | Penalties: <b>15</b></div>
  //   </div>
  // Or if they haven't raced this year:
  // <div class="rdrResultsSum"><div>0 km in <b>0</b> days | PCS points: <b></b> |  UCI points: <b></b> </div></div>
  const uciPointsText = resultsSum.textContent.match(/UCI points: ([\d.]+)/)?.[1];
  if (!uciPointsText && !resultsSum.textContent.includes('0 km in 0 days')) {
    throw new Error(`Data not in expected format at ${pcsUrl}`);
  }
  const uciPoints = Number(uciPointsText) || 0;
  const sanctions = Number(resultsSum.textContent.match(/Penalties: ([\d.]+)/)?.[1]) || 0;

  return {
    uciPoints,
    sanctions,
  };
}
