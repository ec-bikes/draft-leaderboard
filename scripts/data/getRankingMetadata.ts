import { formatDate, formatDateTime, makeUtcDate } from '../../common/formatDate.js';
import type { Group, TeamJsonMetadata } from '../../common/types/index.js';
import { getUciRankingMoments } from './uci/getUciRankingMoments.js';

const schemaVersion = 1;

export interface RankingMetadataResult {
  /** Date used in filenames (will be formatted as UTC): ranking date for UCI, fetch date if PCS */
  fileDate: Date;
  metadata: TeamJsonMetadata;
}

/**
 * Get the `momentId` value used by UCI APIs, as well as the ranking date corresponding to that ID,
 * and the current date/time when the data is being fetched.
 */
export async function getRankingMetadata(params: {
  group: Group;
  source: 'uci' | 'pcs';
}): Promise<RankingMetadataResult | string> {
  const { group, source } = params;

  // Get the fetch date with hour and minute in UTC time
  const fetchedDate = formatDateTime(new Date());

  const moments = await getUciRankingMoments(group);
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

  let uciRankingDate: string | undefined;
  let fileDate = new Date();
  if (source === 'uci') {
    // This comes in DD/MM/YYYY format. Convert it to an unambiguous text-based date.
    const uciRankingDateParts = moment.Name.split('/').map(Number);
    const rdate = makeUtcDate(
      uciRankingDateParts[2],
      uciRankingDateParts[1],
      uciRankingDateParts[0],
    );
    uciRankingDate = formatDate(rdate);
    fileDate = rdate;
  }

  return {
    fileDate,
    metadata: {
      source,
      schemaVersion,
      momentId: moment.Id,
      uciRankingDate,
      fetchedDate,
    },
  };
}
