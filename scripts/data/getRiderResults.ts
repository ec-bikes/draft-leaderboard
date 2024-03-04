import { getRiderResultsPostData, getUciHeaders, riderResultsApiUrl } from './uciUrls';
import type { UciApiResult, UciRiderResult } from '../types/UciData';
import type { RawRider } from '../types/RawTeam';
import type { RaceResult, Rider } from '../../src/types/Rider';

/**
 * Get race results for a rider. Returns results or an error message.
 */
export async function getRiderResults(params: {
  rider: RawRider;
  momentId: number;
}): Promise<Pick<Rider, 'totalPoints' | 'results'> | string> {
  const { momentId, rider } = params;
  const { name, id } = rider;

  let rawResults: UciRiderResult[];
  try {
    const result = await fetch(riderResultsApiUrl, {
      method: 'POST',
      headers: getUciHeaders(),
      body: getRiderResultsPostData({ individualId: id, momentId }),
    });
    const text = await result.text();
    const json = JSON.parse(text) as UciApiResult<UciRiderResult>;
    if (json.data.length < json.total) {
      // possibly need to try the paging params (but the API seems to ignore them)
      console.error(
        `❌ Expected ${json.total} results for ${name}, but only got ${json.data.length}`,
      );
      return 'Incomplete results for rider';
    }
    rawResults = json.data;
  } catch (err) {
    console.error(`❌ Error getting results for ${name}:`, (err as Error).message || err);
    return 'Error getting results for rider';
  }

  let totalPoints = 0;
  const results: RaceResult[] = [];
  for (const result of rawResults) {
    if (result.IsInvalidResult) {
      console.log(`⚠️ Invalid result for ${name}:`, result);
      continue;
    }
    if (new Date(result.Date).getFullYear() !== 2024) {
      continue;
    }

    totalPoints += result.Points;
    let resultName: string;
    if (result.IsSpecialResult && result.SpecialName) {
      // WWT leader's jersey probably
      resultName = result.SpecialName;
    } else if (result.ClassCode[0] === '1') {
      // One-day race. CompetitionName is the actual race name.
      // Just use that instead of e.g. "Omloop Nieuwsblad - Final Result - General Classification"
      resultName = result.CompetitionName;
    } else if (result.ClassCode[0] === 'C') {
      // Championship. CompetitionName is e.g. "National Road Championships - Netherlands".
      // RaceName is e.g. "Women Elite - Individual Road Race".
      resultName = `${result.CompetitionName} - ${result.RaceName}`;
    } else {
      resultName = result.Name;
    }

    results.push({ name: resultName, date: result.Date, points: result.Points });
  }

  return { totalPoints, results };
}
