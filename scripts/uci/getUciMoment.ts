import { makeUtcDate } from '../../common/formatDate.js';
import type { Group } from '../../common/types/index.js';
import { fetchUciRankingMoments } from './uciApis.js';

/**
 * Get the most recent UCI ranking moment ID and the corresponding date.
 *
 * A UCI ranking moment is a specific point in time when the UCI ranking is calculated.
 * It appears to happen at the start of every Tuesday.
 */
export async function getUciMoment(params: { group: Group }): Promise<
  | {
      momentId: number;
      /** UTC date (time=0) corresponding to ranking date */
      rankingDate: Date;
    }
  | string
> {
  const { group } = params;

  const moments = await fetchUciRankingMoments(group);
  if (typeof moments === 'string') {
    return moments;
  }

  // Result will be like this, where dates are in DD/MM/YYYY format:
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

  // This comes in DD/MM/YYYY format
  const uciRankingDateParts = moment.Name.split('/').map(Number);
  const rankingDate = makeUtcDate(
    uciRankingDateParts[2],
    uciRankingDateParts[1],
    uciRankingDateParts[0],
  );

  return { momentId: moment.Id, rankingDate };
}
