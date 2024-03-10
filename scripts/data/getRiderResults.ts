import type { RawRider } from '../types/RawTeam';
import type { RaceResult, Rider } from '../../src/types/Rider';
import { getUciRiderResults } from './uciApis';

/**
 * Get race results for a rider from the UCI API.
 * Returns results or an error message.
 */
export async function getRiderResults(params: {
  rider: RawRider;
  momentId: number;
}): Promise<Pick<Rider, 'totalPoints' | 'results'> | string> {
  const { momentId, rider } = params;
  const { name, id } = rider;

  const rawResults = await getUciRiderResults({ momentId, individualId: id });
  if (typeof rawResults === 'string') {
    console.error(`❌ Error getting results for ${name}:`, rawResults);
    return 'Error getting results for rider';
  }

  let totalPoints = 0;
  const results: RaceResult[] = [];
  for (const result of rawResults) {
    if (result.IsInvalidResult) {
      // not sure what this means, so log if it happens
      console.log(`⚠️ Invalid result for ${name} (ignoring):`, result);
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
