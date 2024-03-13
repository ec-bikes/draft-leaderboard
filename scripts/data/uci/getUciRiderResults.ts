import type { UciRiderResult } from './types/UciRiderResult.js';
import type { Group } from '../../../common/types/Group.js';
import { doUciRequest } from './doUciRequest.js';
import { uciRankingParams } from '../../../common/uciRankingParams.js';

/**
 * Get details of a rider's results.
 * Returns the results or an error string.
 */
export function getUciRiderResults(params: {
  momentId: number;
  individualId: number;
  group: Group;
}): Promise<UciRiderResult[] | string> {
  const { group, individualId, momentId } = params;
  const { rankingTypeId, ...otherParams } = uciRankingParams[group];

  // https://dataride.uci.ch/iframe/IndividualEventRankings/
  // individualId=151466&rankingId=32&momentId=175727&groupId=2&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0&take=40&skip=0&page=1&pageSize=40
  return doUciRequest({
    url: 'https://dataride.uci.ch/iframe/IndividualEventRankings/',
    postData: {
      individualId,
      momentId,
      ...otherParams,
      baseRankingTypeId: rankingTypeId,
      raceTypeId: 0,
      countryId: 0,
      teamId: 0,
    },
  });
}
