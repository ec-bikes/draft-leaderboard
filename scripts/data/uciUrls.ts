// momentId = 175727
const rankingId = 32;
const rankingTypeId = 1;
const disciplineId = 10;
const commonParams = {
  groupId: 2,
  disciplineId,
  disciplineSeasonId: 432,
  categoryId: 23,
  raceTypeId: 0,
};
const riderParams = {
  ...commonParams,
  rankingId,
  baseRankingTypeId: rankingTypeId,
  countryId: 0,
  teamId: 0,
};

/** Format query params, accepting numbers, encoding if needed */
function formatQueryParams(params: Record<string, string | number>): string {
  return new URLSearchParams(params as Record<string, string>).toString();
}

function formatUrl(base: string, params: Record<string, string | number>) {
  return base + '?' + formatQueryParams(params);
}

/** Get headers for a UCI API request */
export function getUciHeaders() {
  return {
    'content-type': 'application/x-www-form-urlencoded',
  };
}

/** Get the women's season ranking page URL */
export function seasonRankingUrl(params: { momentId: number }) {
  // https://dataride.uci.ch/iframe/RankingDetails/32?disciplineId=10&groupId=2&momentId=175727&disciplineSeasonId=432&rankingTypeId=1&categoryId=23&raceTypeId=0
  return formatUrl('https://dataride.uci.ch/iframe/RankingDetails/' + rankingId, {
    ...commonParams,
    ...params,
    rankingTypeId,
  });
  /*
  get the list of riders from the page
  copy(
    [...document.querySelectorAll('.uci-table-wrapper > table > tbody > tr')]
      .map((r) => r.querySelector('a'))
      .filter(Boolean)
      .map((a) => `${a.href.match(/RiderRankingDetails\/(\d+)/)?.[1]} ${a.textContent.trim()}`)
      .join('\n'),
  );
  */
}

/** Get a women's rider page URL */
export function getRiderUrl(params: { momentId: number; individualId: number }) {
  const { individualId, momentId } = params;
  // https://dataride.uci.ch/iframe/RiderRankingDetails/151466?rankingId=32&groupId=2&momentId=175727&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0
  return formatUrl('https://dataride.uci.ch/iframe/RiderRankingDetails/' + individualId, {
    ...riderParams,
    momentId,
  });
}

/** API for rider results */
export const riderResultsApiUrl = 'https://dataride.uci.ch/iframe/IndividualEventRankings/';

/** Get post data for a rider's ranking details */
export function getRiderResultsPostData(params: { momentId: number; individualId: number }) {
  // https://dataride.uci.ch/iframe/IndividualEventRankings/
  // individualId=151466&rankingId=32&momentId=175727&groupId=2&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0&take=40&skip=0&page=1&pageSize=40
  return formatQueryParams({
    ...params,
    ...riderParams,
    // the API seems to ignore these limits and return everything
    take: 100,
    skip: 0,
    page: 1,
    pageSize: 100,
  });
}

/** API for searching for a rider by name */
export const riderSearchApiUrl = 'https://dataride.uci.ch/iframe/ObjectRankings/';

/** Get post data to search for a rider by name */
export function getRiderSearchPostData(text: string) {
  // Search example "vollering"
  // https://dataride.uci.ch/iframe/ObjectRankings/
  // rankingId=32&disciplineId=10&rankingTypeId=1&take=40&skip=0&page=1&pageSize=40&filter%5Bfilters%5D%5B0%5D%5Bfield%5D=RaceTypeId&filter%5Bfilters%5D%5B0%5D%5Bvalue%5D=0&filter%5Bfilters%5D%5B1%5D%5Bfield%5D=CategoryId&filter%5Bfilters%5D%5B1%5D%5Bvalue%5D=23&filter%5Bfilters%5D%5B2%5D%5Bfield%5D=SeasonId&filter%5Bfilters%5D%5B2%5D%5Bvalue%5D=432&filter%5Bfilters%5D%5B3%5D%5Bfield%5D=MomentId&filter%5Bfilters%5D%5B3%5D%5Bvalue%5D=0&filter%5Bfilters%5D%5B4%5D%5Bfield%5D=CountryId&filter%5Bfilters%5D%5B4%5D%5Bvalue%5D=0&filter%5Bfilters%5D%5B5%5D%5Bfield%5D=IndividualName&filter%5Bfilters%5D%5B5%5D%5Bvalue%5D=vollering&filter%5Bfilters%5D%5B6%5D%5Bfield%5D=TeamName&filter%5Bfilters%5D%5B6%5D%5Bvalue%5D=
  return formatQueryParams({
    rankingId,
    disciplineId,
    rankingTypeId,
    // the API seems to ignore these limits and return everything
    take: 10,
    skip: 0,
    page: 1,
    pageSize: 10,
    'filter[filters][0][value]': 0,
    'filter[filters][1][field]': 'CategoryId',
    'filter[filters][1][value]': commonParams.categoryId,
    'filter[filters][2][field]': 'SeasonId',
    'filter[filters][2][value]': commonParams.disciplineSeasonId,
    'filter[filters][3][field]': 'MomentId',
    'filter[filters][3][value]': 0,
    'filter[filters][4][field]': 'CountryId',
    'filter[filters][4][value]': 0,
    'filter[filters][5][field]': 'IndividualName',
    'filter[filters][5][value]': text,
    'filter[filters][6][field]': 'TeamName',
    'filter[filters][6][value]': '',
  });
}
