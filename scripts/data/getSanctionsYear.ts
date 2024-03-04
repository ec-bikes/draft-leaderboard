import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import type { RawRider } from '../types/RawTeam';

/**
 * Get sanctions for a specific year from a PCS rider page.
 */
export async function getSanctionsYear(params: {
  rider: RawRider;
  year: number;
}): Promise<number | string> {
  const { rider, year } = params;
  const { name } = rider;
  // By default assume the URL is the lowercase name with dashes
  const pcsName = rider.pcsName || name.toLowerCase().replaceAll(' ', '-');
  const errorStr = `Couldn't get ${year} sanctions data`;

  const pcsUrl = `https://www.procyclingstats.com/rider/${pcsName}/${year}`;
  try {
    const result = await fetch(pcsUrl);
    if (!result.ok) {
      console.error(`❌ Failed to load ${pcsUrl} - ${result.status} ${result.statusText}`);
      return errorStr;
    }

    const root = parse(await result.text());
    const text = root.querySelector('.rdrResultsSum')?.textContent.trim() || '';
    const totals = Object.fromEntries(
      text
        .split('|')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.includes(':') && !s.includes('pcs'))
        .map((s) => s.replaceAll(' ', '').split(':'))
        .map(([key, value]) => [key, parseInt(value)]),
    ) as { ucipoints: number; penalties?: number };

    if (!totals.ucipoints && totals.ucipoints !== 0) {
      console.error(`❌ Data not in expected format at ${pcsUrl}`);
      return errorStr;
    }
    return totals.penalties || 0;
  } catch (err) {
    console.error(
      `❌ Error getting 2023 sanctions from PCS for "${pcsName}": ${(err as Error).message || err}`,
    );
    return errorStr;
  }
}
