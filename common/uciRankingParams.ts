export const uciRankingSeasons = {
  2024: 432,
  2025: 444,
} as const;

const disciplineId = 10; // presumably road
const rankingTypeId = 1;
const disciplineSeasonId = uciRankingSeasons[2025];

/** Parameters used in UCI ranking URLs and request bodies */
export const uciRankingParams = {
  women: {
    rankingId: 32,
    rankingTypeId,
    disciplineId,
    groupId: 2,
    disciplineSeasonId,
    categoryId: 23,
  },
  men: {
    rankingId: 1,
    rankingTypeId,
    disciplineId,
    groupId: 1,
    disciplineSeasonId,
    categoryId: 22,
  },
};
