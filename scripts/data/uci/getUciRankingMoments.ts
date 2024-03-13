import { formatQueryParams } from '../../../common/uciUrls.js';
import type { Group } from '../../../common/types/Group.js';
import { doUciRequest } from './doUciRequest.js';
import { uciRankingParams } from '../../../common/uciRankingParams.js';

// only relevant properties
interface UciRankingMoment {
  /** momentId value, or 0 for most recent */
  Id: number;
  /** Date (DD/MM/YYYY) or "Most Recent Ranking" */
  Name: string;
  /** Seems same as Name */
  DisplayText: string;
}

/**
 * Get UCI ranking moments, or an error string.
 */
export function getUciRankingMoments(group: Group): Promise<UciRankingMoment[] | string> {
  const { disciplineId, disciplineSeasonId, rankingId } = uciRankingParams[group];

  // https://dataride.uci.ch/iframe/GetRankingMoments/?disciplineId=10&disciplineSeasonId=432&rankingId=32
  return doUciRequest({
    url: `https://dataride.uci.ch/iframe/GetRankingMoments/?${formatQueryParams({
      disciplineId,
      disciplineSeasonId,
      rankingId,
    })}`,
    isPlainArray: true,
  });
}
