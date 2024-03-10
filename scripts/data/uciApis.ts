import fetch from 'node-fetch';
import type { UciApiResult, UciRiderResult, UciRiderRanking } from '../types/UciData';

// main road results page
// https://www.uci.org/discipline/road/6TBjsDD8902tud440iv1Cu?tab=rankings

// women's rider page
// https://dataride.uci.ch/iframe/RiderRankingDetails/151466?rankingId=32&groupId=2&momentId=175727&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0

// women's season rankings page
// https://dataride.uci.ch/iframe/RankingDetails/32?disciplineId=10&groupId=2&momentId=175727&disciplineSeasonId=432&rankingTypeId=1&categoryId=23&raceTypeId=0
/*
  get the list of riders and IDs from the page
  copy(
    [...document.querySelectorAll('.uci-table-wrapper > table > tbody > tr')]
      .map((r) => r.querySelector('a'))
      .filter(Boolean)
      .map((a) => `${a.href.match(/RiderRankingDetails\/(\d+)/)?.[1]} ${a.textContent.trim()}`)
      .join('\n'),
  );
*/

const rankingId = 32;
const rankingTypeId = 1;
const disciplineId = 10;
const groupId = 2;
const disciplineSeasonId = 432; // 2024?
const categoryId = 23; // women elite; 22 = men elite
const raceTypeId = 0;

const pageSize = 40;

/**
 * Do a request to a UCI API with paging.
 * Returns the result array or an error string.
 */
async function doUciRequest<TResult>(params: {
  url: string;
  postData: Record<string, string | number>;
  limit?: number;
}): Promise<TResult[] | string> {
  const { url, postData, limit = Infinity } = params;
  let data: TResult[] = [];

  for (let page = 1; data.length < limit; page++) {
    const body = new URLSearchParams({
      ...postData,
      take: pageSize,
      skip: (page - 1) * pageSize,
      page,
      pageSize,
      // the types don't accept numbers, but it works fine
    } as unknown as Record<string, string>).toString();

    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!result.ok) {
        return `returned ${result.status} ${result.statusText}`;
      }

      const text = await result.text();
      const json = JSON.parse(text) as UciApiResult<TResult>;
      data = data.concat(json.data);

      if (data.length >= json.total) {
        break;
      }
    } catch (err) {
      const requestDesc = `POST ${url} ${body}`;
      if (err instanceof SyntaxError) {
        return `${requestDesc} returned non-JSON response (probably an error page)`;
      }
      return `Error while requesting ${requestDesc} - ${(err as Error).message || err}`;
    }
  }

  return data;
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
      raceTypeId,
      rankingId,
      baseRankingTypeId: rankingTypeId,
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
