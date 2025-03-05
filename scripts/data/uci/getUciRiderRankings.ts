import type { Group } from '../../../common/types/index.js';
import { uciRankingParams } from '../../../common/uciRankingParams.js';
import { doUciRequest } from './doUciRequest.js';
import type { UciRiderRanking } from './types/UciRiderRanking.js';

const riderRankingsUrl = 'https://dataride.uci.ch/iframe/ObjectRankings/';

/**
 * Get the top `limit` riders in the ranking.
 * Returns the results or an error string.
 */
export function getUciRiderRankings(params: {
  limit: number;
  group: Group;
}): Promise<UciRiderRanking[] | string> {
  const { limit, group } = params;
  const { rankingId, disciplineId, rankingTypeId, categoryId, disciplineSeasonId } =
    uciRankingParams[group];

  return doUciRequest({
    url: riderRankingsUrl,
    limit,
    postData: {
      rankingId,
      disciplineId,
      rankingTypeId,
      'filter[filters][0][field]': 'RaceTypeId',
      'filter[filters][0][value]': 0,
      'filter[filters][1][field]': 'CategoryId',
      'filter[filters][1][value]': categoryId,
      'filter[filters][2][field]': 'SeasonId',
      'filter[filters][2][value]': disciplineSeasonId,
    },
  });
}

/**
 * Search the rider rankings.
 * Returns the result or an error string.
 */
export function searchUciRiderRankings(params: {
  text: string;
  group: Group;
}): Promise<UciRiderRanking[] | string> {
  const { text, group } = params;
  const { rankingId, disciplineId, rankingTypeId, categoryId, disciplineSeasonId } =
    uciRankingParams[group];

  // Search example "vollering"
  // https://dataride.uci.ch/iframe/ObjectRankings/
  // rankingId=32&disciplineId=10&rankingTypeId=1&take=40&skip=0&page=1&pageSize=40&filter%5Bfilters%5D%5B0%5D%5Bfield%5D=RaceTypeId&filter%5Bfilters%5D%5B0%5D%5Bvalue%5D=0&filter%5Bfilters%5D%5B1%5D%5Bfield%5D=CategoryId&filter%5Bfilters%5D%5B1%5D%5Bvalue%5D=23&filter%5Bfilters%5D%5B2%5D%5Bfield%5D=SeasonId&filter%5Bfilters%5D%5B2%5D%5Bvalue%5D=432&filter%5Bfilters%5D%5B3%5D%5Bfield%5D=MomentId&filter%5Bfilters%5D%5B3%5D%5Bvalue%5D=0&filter%5Bfilters%5D%5B4%5D%5Bfield%5D=CountryId&filter%5Bfilters%5D%5B4%5D%5Bvalue%5D=0&filter%5Bfilters%5D%5B5%5D%5Bfield%5D=IndividualName&filter%5Bfilters%5D%5B5%5D%5Bvalue%5D=vollering&filter%5Bfilters%5D%5B6%5D%5Bfield%5D=TeamName&filter%5Bfilters%5D%5B6%5D%5Bvalue%5D=
  return doUciRequest<UciRiderRanking>({
    url: riderRankingsUrl,
    postData: {
      rankingId,
      disciplineId,
      rankingTypeId,
      'filter[filters][0][value]': 0,
      'filter[filters][1][field]': 'CategoryId',
      'filter[filters][1][value]': categoryId,
      'filter[filters][2][field]': 'SeasonId',
      'filter[filters][2][value]': disciplineSeasonId,
      'filter[filters][3][field]': 'MomentId',
      'filter[filters][3][value]': 0,
      'filter[filters][4][field]': 'CountryId',
      'filter[filters][4][value]': 0,
      'filter[filters][5][field]': 'IndividualName',
      'filter[filters][5][value]': text,
      'filter[filters][6][field]': 'TeamName',
      'filter[filters][6][value]': '',
    },
  });
}
