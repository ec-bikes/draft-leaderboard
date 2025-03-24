import { parseDate } from '../../common/dates.js';
import type { BaseRider, Group, RaceResult } from '../../common/types/index.js';
import { logWarning } from '../log.js';
import { fetchUciRiderResults } from './uciApis.js';

/**
 * Get the current year's race results for a rider from the UCI API.
 * Throws if there's an error fetching data.
 */
export async function getUciRiderResults(params: {
  rider: BaseRider;
  momentId: number;
  year: number;
  group: Group;
}): Promise<RaceResult[]> {
  const { momentId, rider, year, group } = params;
  const { name, id } = rider;

  const rawResults = await fetchUciRiderResults({ momentId, individualId: id, group });
  if (typeof rawResults === 'string') {
    // It's critical to get everyone's race results, so stop if something is going wrong
    throw new Error(`Couldn't get results for ${name}: ${rawResults}`);
  }

  const results: RaceResult[] = [];
  for (const result of rawResults) {
    if (result.IsInvalidResult) {
      // not sure what this means, so log if it happens
      logWarning(`⚠️ Invalid result for ${name} (ignoring):`, result);
      continue;
    }

    // UCI APIs return 12 month rolling results
    if (parseDate(result.Date).year() !== year) {
      continue;
    }

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

    results.push({
      name: resultName,
      date: result.Date,
      points: result.Points,
      rank: result.Rank || undefined,
    });
  }

  return results;
}
