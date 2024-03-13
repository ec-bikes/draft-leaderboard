import type { Group } from '../../src/types/Rider.js';
import type { TeamJsonMetadata } from '../../src/types/Team.js';
import { getUciRankingMoments } from './uciApis.js';

/**
 * Get the `momentId` value used by UCI APIs, as well as the ranking date corresponding to that ID,
 * and the current date/time when the data is being fetched.
 */
export async function getRankingMetadata(
  group: Group,
): Promise<(TeamJsonMetadata & { rankingDateShort: string }) | string> {
  // These values appear to be the same for men and women
  const moments = await getUciRankingMoments(group);
  if (typeof moments === 'string') {
    return moments;
  }

  // Result will be like:
  // [
  //   { Id: 0, Name: 'Most Recent Ranking', Sequence: 0, DisplayText: 'Most Recent Ranking' },
  //   { Id: 176133, Name: '05/03/2024', Sequence: 0, DisplayText: '05/03/2024' },
  //   ...
  // ]
  const moment = moments.find((m) => m.Id !== 0 && /^\d{2}\/\d{2}\/\d{4}$/.test(m.Name));
  if (!moment) {
    return (
      "Couldn't find most recent UCI rankings moment in expected format. Received: " +
      JSON.stringify(moments, null, 2)
    );
  }

  // This comes in DD/MM/YYYY format. Convert it to an unambiguous text-based date.
  const rankingDateParts = moment.Name.split('/').map(Number);
  const rdate = new Date(rankingDateParts[2], rankingDateParts[1] - 1, rankingDateParts[0]);
  const rankingDate = rdate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const rankingDateShort = rdate.toISOString().slice(0, 10);

  // Get the fetch date with hour and minute in UTC time
  const fetchDate =
    new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'UTC',
    }) + ' GMT';

  return {
    schemaVersion: 1,
    momentId: moment.Id,
    rankingDate,
    rankingDateShort,
    fetchedDate: fetchDate,
  };
}
