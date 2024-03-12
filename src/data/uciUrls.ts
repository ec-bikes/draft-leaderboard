// main road results page
// https://www.uci.org/discipline/road/6TBjsDD8902tud440iv1Cu?tab=rankings

import type { Group } from '../types/Rider.js';

// women's season rankings page
// https://dataride.uci.ch/iframe/RankingDetails/32?disciplineId=10&groupId=2&momentId=175727&disciplineSeasonId=432&rankingTypeId=1&categoryId=23&raceTypeId=0

// men's worldtour season rankings page
// https://dataride.uci.ch/iframe/RankingDetails/1?disciplineId=10&groupId=1&momentId=176122&disciplineSeasonId=432&rankingTypeId=1&categoryId=22&raceTypeId=0

const disciplineId = 10; // presumably road
const rankingTypeId = 1;
const disciplineSeasonId = 432; // 2024?

/** Parameters used in URLs for the women's rankings */
export const womensRankingParams = {
  rankingId: 32,
  rankingTypeId,
  disciplineId,
  groupId: 2,
  disciplineSeasonId,
  categoryId: 23,
} as const;

export const mensRankingParams = {
  rankingId: 1,
  rankingTypeId,
  disciplineId,
  groupId: 1,
  disciplineSeasonId,
  categoryId: 22,
} as const;

/** Format query params, accepting numbers, encoding if needed */
export function formatQueryParams(params: Record<string, string | number>): string {
  return new URLSearchParams(params as Record<string, string>).toString();
}

/** Get the season ranking page URL */
export function getUciSeasonRankingUrl(params: { momentId: number; group: Group }) {
  const { group, momentId } = params;
  const { rankingId, ...otherParams } = group === 'women' ? womensRankingParams : mensRankingParams;

  // https://dataride.uci.ch/iframe/RankingDetails/32?disciplineId=10&groupId=2&momentId=175727&disciplineSeasonId=432&rankingTypeId=1&categoryId=23&raceTypeId=0
  return `https://dataride.uci.ch/iframe/RankingDetails/${rankingId}?${formatQueryParams({
    ...otherParams,
    raceTypeId: 0,
    momentId,
  })}`;
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

/** Get a rider results page URL */
export function getUciRiderUrl(params: { momentId: number; individualId: number; group: Group }) {
  const { group, individualId, momentId } = params;
  const { rankingTypeId, ...otherParams } =
    group === 'women' ? womensRankingParams : mensRankingParams;

  // https://dataride.uci.ch/iframe/RiderRankingDetails/151466?rankingId=32&groupId=2&momentId=175727&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0
  return `https://dataride.uci.ch/iframe/RiderRankingDetails/${individualId}?${formatQueryParams({
    ...otherParams,
    baseRankingTypeId: rankingTypeId,
    raceTypeId: 0,
    countryId: 0,
    teamId: 0,
    momentId,
  })}`;
}
