import type { PointsHistory } from './PointsHistory.js';
import type { ExtraRiderInfo } from './Rider.js';
import type { Team, TeamDetails, UciTeamNames } from './Team.js';

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

/** Data about actual UCI teams and countries of riders */
export interface UciTeamsJson {
  teamNames: UciTeamNames;
  /** Mapping from rider ID to country and team. Name is added for readability. */
  riderInfo: Record<
    number,
    ExtraRiderInfo & {
      /** Rider name */
      name: string;
    }
  >;
}
