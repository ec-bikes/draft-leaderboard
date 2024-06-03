import type { Team, TeamDetails } from './Team.js';

/** Ranking and fetch dates for team data */
export type TeamJsonMetadata = {
  schemaVersion: 1;
  source: 'uci' | 'pcs';
  /** Data fetch date (display-friendly, not for parsing) */
  fetchedDate: string;
  /** UCI ranking momentId for URLs or further requests */
  momentId: number;
  /** UCI ranking date (display-friendly), only if `source` is `uci`. */
  rankingDate?: string;
};

/** Short data about all the teams (no individual race results) */
export type TeamsSummaryJson = TeamJsonMetadata & {
  teams: Team[];
};

/** Data about a team including individual race results */
export type TeamDetailsJson = TeamJsonMetadata & {
  team: TeamDetails;
};
