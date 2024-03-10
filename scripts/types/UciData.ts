export interface UciApiResult<T> {
  data: T[];
  total: number;
}

// not complete
const classData = {
  '1.WWT': { id: 186, name: '1 day - UCI Women’s WorldTour' },
  '2.WWT': { id: 187, name: 'Stages - UCI Women’s WorldTour' },
  '1.Pro': { id: 190, name: '1 day - ProSeries' },
  '2.Pro': { id: 192, name: 'Stages - ProSeries' },
  '1.1': { id: 4, name: '1 day - Class 1' },
  '2.2U': { id: 28, name: 'Stages - Class 2 - U23' },
  CC: { id: 72, name: 'Continental Championships' },
  CM: { id: 86, name: 'UCI World Championships' },
  CN: { id: 93, name: 'National Championships' },
} as const;

const eventData = {
  'General Classification': 1,
  // stage result
  'Stage Classification': 17,
  // bonus for leading GC after a stage
  'Stage General Classification': 21,
} as const;

// TODO
// U23 rider
// rider with lower-level and non-UCI races
// do those points count?
export interface UciRiderResult {
  ResultId: number;
  ClassId: (typeof classData)[this['ClassCode']]['id'];
  /** e.g. 1.WWT */
  ClassCode: keyof typeof classData;
  /** e.g. "1 day - UCI Women's WorldTour" */
  ClassName: (typeof classData)[this['ClassCode']]['name'];
  EventName: keyof typeof eventData;
  RaceName:
    | 'Final Result' /*1-day*/
    | `Stage ${number}`
    | `Women Elite ${string}` /*champs*/
    | `Women Under 23 ${string}`
    | 'Final Classification' /*GC final?*/
    | 'Team Time Trial Mixed Relay';
  /** Actual race name */
  CompetitionName: string;
  SpecialName: string | null;
  StartDate: `/Date(${number})/`;
  IsSpecialResult: boolean;
  Points: number;
  IsInvalidResult: boolean;
  /** points formatted for display */
  DisplayPoints: string;
  /** race rank if applicable */
  Rank: number | null;
  ComputedPointId: number;
  PointsRuleId: 1 | 2 /*WWT stage bonus*/ | 5 /*pro stage bonus*/ | 6 /*WWT leader's jersey*/;
  PointsRuleParentId: 1 | 3 /*WWT stage bonus*/ | 2 /*pro stage bonus*/ | 5 /*WWT leader's jersey*/;
  EventTypeId: (typeof eventData)[this['EventName']];
  RankingId: 32;
  /** short date e.g. "07 Sep 2023" */
  Date: string;
  /** repeat of ClassName but with a hidden ordering number sometimes */
  ClassOrder: `${`<span style='display: none'>${number}</span>` | ''}${this['ClassName']}`;
  /** everything strung together */
  Name:
    | `${this['CompetitionName']} - ${this['RaceName']} - ${this['EventName']}`
    | NonNullable<this['SpecialName']>;
}

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
  DisciplineSeasonId: 432;
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
