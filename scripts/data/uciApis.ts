import fetch, { type RequestInit } from 'node-fetch';
import type {
  UciApiResult,
  UciRiderResult,
  UciRiderRanking,
  UciRankingMoment,
} from '../types/UciData';
import { formatQueryParams, womensRankingParams } from '../../src/data/uciUrls';

const { groupId, disciplineId, disciplineSeasonId, categoryId, rankingId, rankingTypeId } =
  womensRankingParams;

const pageSize = 40;

/**
 * Do a request to a UCI API with paging.
 * Returns the result array or an error string.
 */
async function doUciRequest<TResult>(params: {
  url: string;
  /** Body data for POST request. Assumes a GET request if not set. */
  postData?: Record<string, string | number>;
  /** Limit on number of items to fetch (default infinity) */
  limit?: number;
  /** If true, assume the response is a complete array of items (not paged) */
  isPlainArray?: boolean;
  isRetry?: boolean;
}): Promise<TResult[] | string> {
  const { url, postData, limit = Infinity, isPlainArray, isRetry } = params;
  let data: TResult[] = [];

  // Get multiple pages if needed, up to the limit, or until all data is fetched.
  // (the loop includes some breaks internally)
  for (let page = 1; data.length < limit; page++) {
    let requestInit: RequestInit;
    if (postData) {
      requestInit = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: formatQueryParams({
          ...postData,
          take: pageSize,
          skip: (page - 1) * pageSize,
          page,
          pageSize,
        }),
      };
    } else {
      requestInit = { method: 'GET' };
    }
    // time out after 10s
    requestInit.signal = AbortSignal.timeout(10000);
    const requestDesc = `${requestInit.method} ${url} ${requestInit.body || ''}`;

    try {
      const result = await fetch(url, requestInit);
      if (!result.ok) {
        return `Got ${result.status} ${result.statusText} for ${requestDesc}`;
      }

      const text = await result.text();
      const json = JSON.parse(text);
      if (isPlainArray) {
        // for a plain array response, there's just one page, so stop now
        data = json;
        break;
      }

      // add this page's data and stop if there's no more
      const pageData = json as UciApiResult<TResult>;
      data = data.concat(pageData.data);
      if (data.length >= pageData.total) {
        break;
      }
    } catch (err) {
      let message: string;
      if (err instanceof SyntaxError) {
        message = `Got a non-JSON response (probably an error page) from ${requestDesc}`;
      } else {
        message = `Error while requesting ${requestDesc} - ${(err as Error).message || err}`;
      }

      if (isRetry) {
        return message;
      }
      console.warn(`⚠️ First fetch attempt failed (will retry): ${message}`);
      return doUciRequest({ ...params, isRetry: true });
    }
  }

  return data;
}

/**
 * Get UCI ranking moments, or an error string.
 */
export function getUciRankingMoments(): Promise<UciRankingMoment[] | string> {
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

/**
 * Get details of a rider's results.
 * Returns the results or an error string.
 */
export function getUciRiderResults(params: {
  momentId: number;
  individualId: number;
}): Promise<UciRiderResult[] | string> {
  // https://dataride.uci.ch/iframe/IndividualEventRankings/
  // individualId=151466&rankingId=32&momentId=175727&groupId=2&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0&take=40&skip=0&page=1&pageSize=40
  return doUciRequest({
    url: 'https://dataride.uci.ch/iframe/IndividualEventRankings/',
    postData: {
      ...params,
      groupId,
      disciplineId,
      disciplineSeasonId,
      categoryId,
      rankingId,
      baseRankingTypeId: rankingTypeId,
      raceTypeId: 0,
      countryId: 0,
      teamId: 0,
      // the API seems to ignore these limits and return everything
      take: 100,
      skip: 0,
      page: 1,
      pageSize: 100,
    },
  });
}

const riderRankingsUrl = 'https://dataride.uci.ch/iframe/ObjectRankings/';

/**
 * Search the rider rankings.
 * Returns the result or an error string.
 */
export function searchUciRiderRankings(text: string): Promise<UciRiderRanking[] | string> {
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

// /**
//  * Get the top `limit` riders.
//  * Returns the results or an error string.
//  */
// export function getUciRiderRankings(limit: number): Promise<UciRiderRanking[] | string> {
//   return doUciRequest({
//     url: riderRankingsUrl,
//     limit,
//     postData: {
//       rankingId,
//       disciplineId,
//       rankingTypeId,
//       'filter[filters][0][field]': 'RaceTypeId',
//       'filter[filters][0][value]': raceTypeId,
//       'filter[filters][1][field]': 'CategoryId',
//       'filter[filters][1][value]': categoryId,
//       'filter[filters][2][field]': 'SeasonId',
//       'filter[filters][2][value]': disciplineSeasonId,
//     },
//   });
// }
