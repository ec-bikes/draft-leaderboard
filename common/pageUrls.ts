// This file is for URLs within this site.

import { years } from './constants.js';

export const baseUrl = '/draft-leaderboard/';

export function getPageUrl(group: string, year: number = years[0]) {
  const isCurrentYear = year === years[0];
  const groupUrl = baseUrl + group;
  return isCurrentYear ? groupUrl : `${groupUrl}/${year}`;
}
