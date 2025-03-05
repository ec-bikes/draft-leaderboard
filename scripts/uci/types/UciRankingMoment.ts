/**
 * Ranking moments (relevant properties only)
 */
export interface UciRankingMoment {
  /** momentId value, or 0 for most recent */
  Id: number;
  /** Date (DD/MM/YYYY) or "Most Recent Ranking" */
  Name: string;
  /** Seems same as Name */
  DisplayText: string;
}
