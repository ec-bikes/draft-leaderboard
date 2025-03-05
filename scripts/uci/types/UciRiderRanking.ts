import type { uciRankingSeasons } from '../../../common/uciRankingParams.js';

/**
 * Rider ranking info returned from the UCI rankings API (see `getUciRiderRankings` and
 * `searchUciRiderRankings`).
 */
export interface UciRiderRanking {
  /** rider ID used for queries */
  ObjectId: number;
  ObjectTypeId: 1;
  Rank: number;
  PrecedingRank: number;
  /** full UCI ID? don't use this */
  UciId: number;
  DisplayName: string;
  /** full name including team abbreviation */
  FullName: string;
  /** full name no team */
  IndividualFullName: string;
  /** team name */
  TeamName: string | null;
  TeamCode: string | null;
  ParaSportClassCode: null;
  /** nation code */
  NationName: string;
  /** nation name */
  NationFullName: string;
  BirthDate: `/Date(${number})/`;
  Ages: number;
  Points: number;
  /** 12-month rolling sanction points */
  SanctionPoints: number;
  ResultTeamTypeId: 0;
  DisciplineSeasonId: (typeof uciRankingSeasons)[keyof typeof uciRankingSeasons];
  RankingId: 0;
  GroupId: 0;
  MomentId: number;
  ComputationDate: `/Date(${number})/`;
  SeasonEndDate: `/Date(${number})/`;
  DisciplineCode: 'ROA';
  BaseRankingTypeId: 0;
  DisciplineId: 0;
  RankingInformation: null;
  CountryIsoCode2: string;
  CountryId: number;
  TeamId: 0;
  MandatoryDate: `/Date(-${number})/`;
  CompetitionName: null;
  CategoryName: null;
  RaceTypeName: null;
  EventTypeName: null;
  LegalSelectionCode: 0;
  IndividualEventRankings: [];
  TotalIndividualEventRankings: 0;
  ClassId: 0;
  ClassCode: null;
  RankDifference: number;
  FlagCode: string;
  /** ranking with suffix e.g. 1st */
  Position: string;
  /** team display name */
  DisplayTeam: string | null;
}
