import fetch from 'node-fetch';
import { getRiderSearchPostData, getUciHeaders, riderSearchApiUrl } from './uciUrls';
import type { UciApiResult, UciRiderSearchData } from '../types/UciData';
import type { RawRider } from '../types/RawTeam';

/**
 * Get sanctions (probably 12mo rolling) from a UCI rider search.
 */
export async function getSanctions12Mo(rider: RawRider): Promise<number | string> {
  const searchText = rider.searchName || rider.name;
  const errorStr = "Couldn't get 12-mo sanctions";
  try {
    const result = await fetch(riderSearchApiUrl, {
      method: 'POST',
      headers: getUciHeaders(),
      body: getRiderSearchPostData(searchText),
    });
    const text = await result.text();
    const json = JSON.parse(text) as UciApiResult<UciRiderSearchData>;
    if (json.total > 1) {
      console.error(
        `❌ More than one result for "${searchText}": ${json.data.map((r) => r.DisplayName).join(', ')}`,
      );
      return errorStr;
    }
    if (json.total === 0) {
      console.error(`❌ No results for "${searchText}"`);
      return errorStr;
    }
    return json.data[0].SanctionPoints || 0;
  } catch (err) {
    console.error(`❌ ${(err as Error).message || err}`);
    return errorStr;
  }
}
