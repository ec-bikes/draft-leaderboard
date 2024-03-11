// main road results page
// https://www.uci.org/discipline/road/6TBjsDD8902tud440iv1Cu?tab=rankings

// women's season rankings page
// https://dataride.uci.ch/iframe/RankingDetails/32?disciplineId=10&groupId=2&momentId=175727&disciplineSeasonId=432&rankingTypeId=1&categoryId=23&raceTypeId=0

/** Parameters used in URLs for the women's rankings */
export const womensRankingParams = {
  rankingId: 32,
  rankingTypeId: 1,
  disciplineId: 10,
  groupId: 2,
  disciplineSeasonId: 432, // 2024?
  categoryId: 23, // 22 = men elite
};

/** Format query params, accepting numbers, encoding if needed */
export function formatQueryParams(params: Record<string, string | number>): string {
  return new URLSearchParams(params as Record<string, string>).toString();
}

/** Get the women's season ranking page URL */
export function getUciSeasonRankingUrl(params: { momentId: number }) {
  // https://dataride.uci.ch/iframe/RankingDetails/32?disciplineId=10&groupId=2&momentId=175727&disciplineSeasonId=432&rankingTypeId=1&categoryId=23&raceTypeId=0
  return `https://dataride.uci.ch/iframe/RankingDetails/${womensRankingParams.rankingId}?${formatQueryParams(
    {
      groupId: womensRankingParams.groupId,
      disciplineId: womensRankingParams.disciplineId,
      disciplineSeasonId: womensRankingParams.disciplineSeasonId,
      categoryId: womensRankingParams.categoryId,
      rankingTypeId: womensRankingParams.rankingTypeId,
      raceTypeId: 0,
      ...params,
    },
  )}`;
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
}

/** Get a women's rider page URL */
export function getUciRiderUrl(params: { momentId: number; individualId: number }) {
  const { individualId, momentId } = params;
  // https://dataride.uci.ch/iframe/RiderRankingDetails/151466?rankingId=32&groupId=2&momentId=175727&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0
  return `https://dataride.uci.ch/iframe/RiderRankingDetails/${individualId}?${formatQueryParams({
    groupId: womensRankingParams.groupId,
    disciplineId: womensRankingParams.disciplineId,
    disciplineSeasonId: womensRankingParams.disciplineSeasonId,
    categoryId: womensRankingParams.categoryId,
    rankingId: womensRankingParams.rankingId,
    baseRankingTypeId: womensRankingParams.rankingTypeId,
    raceTypeId: 0,
    countryId: 0,
    teamId: 0,
    momentId,
  })}`;
}
