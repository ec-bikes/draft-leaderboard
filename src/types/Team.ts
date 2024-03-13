import type { Rider, RiderDetails } from './Rider.js';

/** Team info without individual race results */
export interface Team {
  owner: string;
  name: string;
  totalPoints: number;
  /** Rider summary data (no race results) */
  riders: Rider[];
}

/** Team details including individual race results */
export interface TeamDetails extends Omit<Team, 'riders'> {
  /** Rider data with race results */
  riders: RiderDetails[];
}

/** Ranking and fetch dates for team data */
export interface TeamJsonMetadata {
  schemaVersion: 1;
  /** UCI ranking momentId for further requests */
  momentId: number;
  /** UCI ranking date (display-friendly, not for parsing) */
  rankingDate: string;
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
