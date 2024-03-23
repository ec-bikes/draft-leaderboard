import type { Team, TeamDetails } from './Team.js';

/** Ranking and fetch dates for team data */
export interface TeamJsonMetadata {
  schemaVersion: 1;
  /** UCI ranking momentId for further requests */
  momentId: number;
  /** Date in epoch ms */
  rankingDate: number;
  /** UCI ranking date (display-friendly, not for parsing) */
  rankingDateStr: string;
  /** Data fetch date (display-friendly, not for parsing) */
  fetchedDate: string;
}

/** Short data about all the teams (no individual race results) */
export interface TeamsSummaryJson extends TeamJsonMetadata {
  teams: Team[];
}

/** Data about a team including individual race results */
export interface TeamDetailsJson extends TeamJsonMetadata {
  team: TeamDetails;
}
