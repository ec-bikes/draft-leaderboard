import type { Group } from '../../common/types/index.js';
import type { UciRiderRanking } from './types/UciRiderRanking.js';
import { toTitleCase } from '../utils/toTitleCase.js';
import { fetchUciRiderRankings } from './uciApis.js';

/** Normalized rider info. More properties can be added as needed. */
interface NormalizedUciRiderInfo {
  /** Object ID for other requests. */
  id: number;
  /**
   * Name with attempted normalized casing (they come in format LAST First).
   * The casing may not be accurate.
   */
  name: string;
}

/**
 * Fetch the top `fetchUciRankingCount` riders from the UCI ranking and return processed info.
 * @returns The results, or an error string.
 */
export async function getUciRiderList(params: {
  group: Group;
  /** If provided, use this instead of trying to fetch */
  rawRiders?: UciRiderRanking[];
  /** Riders to fetch, default 300 */
  limit?: number;
}): Promise<
  | {
      riders: NormalizedUciRiderInfo[];
      /** Raw data returned for reference */
      rawRiders: UciRiderRanking[];
    }
  | string
> {
  const { group, limit = 300 } = params;

  let rawRiders: UciRiderRanking[];
  if (params.rawRiders) {
    rawRiders = params.rawRiders;
  } else {
    const result = await fetchUciRiderRankings({ limit, group });
    if (typeof result === 'string') {
      return result;
    }
    rawRiders = result;
  }

  // Try to convert the names from "LAST First" to "First Last".
  // This gets interesting with multiple names and non-ASCII characters.
  const riders: NormalizedUciRiderInfo[] = rawRiders.map((rider) => {
    const { DisplayName: rawName, ObjectId: id } = rider;

    // To find the first name, look for the first uppercase letter followed by lowercase.
    // This doesn't work if the second letter is non-ASCII...so include a few known ones,
    // but log a message if it doesn't work.
    let name: string;
    const firstNameIndex = rawName.match(/(?<= )[A-Z][a-zéøá]/)?.index;
    if (firstNameIndex) {
      // First names with a non-ASCII last letter incorrectly have it stored as uppercase
      const firstName = rawName.slice(firstNameIndex).replace(/.$/, (val) => val.toLowerCase());

      // Imperfect attempt to capitalize words in the last name...
      const lastName = toTitleCase(rawName.slice(0, firstNameIndex));

      name = `${firstName} ${lastName}`.trim();
    } else {
      console.log(`❗️ Couldn't find first/last name for ${rawName} ${id}`);
      name = rawName;
    }

    return { name, id };
  });

  return { riders, rawRiders };
}
