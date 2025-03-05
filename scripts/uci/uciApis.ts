//
// This file contains low-level helpers to get results from different APIs.
//

import type { Group } from '../../common/types/index.js';
import { uciRankingParams } from '../../common/uciRankingParams.js';
import { formatQueryParams } from '../../common/uciUrls.js';
import { doUciRequest } from './doUciRequest.js';
import type { UciRankingMoment, UciRiderRanking, UciRiderResult } from './types/index.js';

const riderRankingsUrl = 'https://dataride.uci.ch/iframe/ObjectRankings/';

/**
 * Get the top `limit` riders in the ranking.
 * Returns the results or an error string.
 */
export function fetchUciRiderRankings(params: {
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

/**
 * Get details of a rider's results.
 * Returns the results or an error string.
 */
export function fetchUciRiderResults(params: {
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

/**
 * Get UCI ranking moments, or an error string.
 */
export function fetchUciRankingMoments(group: Group): Promise<UciRankingMoment[] | string> {
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
