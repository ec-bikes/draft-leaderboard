import type { Group } from '../../common/types/Group.js';
import type { TeamJsonMetadata } from '../../common/types/TeamJson.js';
import { formatDate, formatDateTime, formatNumericDate } from './formatDate.js';
import { getUciRankingMoments } from './uci/getUciRankingMoments.js';

/**
 * Get the `momentId` value used by UCI APIs, as well as the ranking date corresponding to that ID,
 * and the current date/time when the data is being fetched.
 */
export async function getRankingMetadata(
  group: Group,
): Promise<(TeamJsonMetadata & { rankingDateShort: string }) | string> {
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

  return {
    schemaVersion: 1,
    momentId: moment.Id,
    rankingDate: formatDate(rdate),
    rankingDateShort: formatNumericDate(rdate),
    // Get the fetch date with hour and minute in UTC time
    fetchedDate: formatDateTime(new Date()),
  };
}
