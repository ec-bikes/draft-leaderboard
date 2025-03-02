import type { PointsHistory } from './PointsHistory.js';
import type { Team, TeamDetails } from './Team.js';

/** Ranking and fetch dates for team data */
export interface TeamJsonMetadata {
  schemaVersion: 1;
  source: 'uci' | 'pcs';
  /** Data fetch date (display-friendly, not for parsing) */
  fetchedDate: string;
  /** UCI ranking momentId for URLs or further requests */
  momentId: number;
  /** UCI ranking date (display-friendly), only if `source` is `uci`. */
  uciRankingDate?: string;
}

/** Short data about all the teams (no individual race results) */
export interface TeamsSummaryJson extends TeamJsonMetadata {
  teams: Team[];
  history?: PointsHistory;
}

/** Data about a team including individual race results */
export interface TeamDetailsJson extends TeamJsonMetadata {
  team: TeamDetails;
}
