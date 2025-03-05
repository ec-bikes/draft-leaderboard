import type { HTMLElement as BasicHTMLElement } from 'node-html-parser';

/**
 * Parse the totals row from a rider's ProCyclingStats page.
 * Throws if the data isn't in the expected format.
 */
export function parsePcsRiderTotals(params: { pcsUrl: string; resultsSum: BasicHTMLElement }): {
  uciPoints: number;
  sanctions: number | undefined;
} {
  const { pcsUrl, resultsSum } = params;

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

  return {
    uciPoints: Number(uciPointsText) || 0,
    // Use undefined if not set so it won't be included in the JSON
    sanctions: Number(resultsSum.textContent.match(/Penalties: ([\d.]+)/)?.[1]) || undefined,
  };
}
