/**
 * Race result from the UCI API (see `getUciRiderResults`).
 *
 * For riders with U23 or other discipline results that don't give UCI elite road points,
 * those results seem to either not be returned or be return with 0 points based on the
 * ranking ID and/or discipline ID.
 */
export interface UciRiderResult {
  ResultId: number;
  /** e.g. 1.WWT */
  ClassCode: keyof typeof classData;
  /** e.g. "1 day - UCI Women's WorldTour" */
  ClassName: (typeof classData)[this['ClassCode']]['name'];
  ClassId: (typeof classData)[this['ClassCode']]['id'];
  EventName: keyof typeof eventData;
  RaceName:
    | 'Final Result' /*1-day*/
    | `Stage ${number}`
    | `Women Elite ${string}` /*champs*/
    | `Women Under 23 ${string}`
    | `Men Elite ${string}` /*champs*/
    | `Men Under 23 ${string}`
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
  RankingId: RankingId;
  /** short date e.g. "07 Sep 2023" */
  Date: string;
  /** repeat of ClassName but with a hidden ordering number sometimes */
  ClassOrder: `${`<span style='display: none'>${number}</span>` | ''}${this['ClassName']}`;
  /** everything strung together */
  Name:
    | `${this['CompetitionName']} - ${this['RaceName']} - ${this['EventName']}`
    | NonNullable<this['SpecialName']>;
}

// not complete
const classData = {
  '1.WWT': { id: 186, name: '1 day - UCI Women’s WorldTour' },
  '2.WWT': { id: 187, name: 'Stages - UCI Women’s WorldTour' },
  '1.UWT': { id: 175, name: '1 day - UCI WorldTour' },
  '2.UWT': { id: 176, name: 'Stages - UCI WorldTour' },
  '1.Pro': { id: 190, name: '1 day - ProSeries' },
  '2.Pro': { id: 192, name: 'Stages - ProSeries' },
  '1.1': { id: 4, name: '1 day - Class 1' },
  '2.1': { id: 24, name: 'Stages - Class 1' },
  '2.2': { id: 27, name: 'Stages - Class 2' },
  '2.2U': { id: 28, name: 'Stages - Class 2 - U23' },
  CM: { id: 86, name: 'UCI World Championships' },
  CC: { id: 72, name: 'Continental Championships' },
  CN: { id: 93, name: 'National Championships' },
} as const;

const eventData = {
  'General Classification': 1,
  'Mountain Classification': 4,
  'Points Classification': 2,
  // stage result
  'Stage Classification': 17,
  // bonus for leading GC after a stage
  'Stage General Classification': 21,
} as const;

enum RankingId {
  men = 1,
  women = 32,
}
