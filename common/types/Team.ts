import type { BaseRider, Rider, RiderDetails } from './Rider.js';

/** Basic team info used in the team definition files */
export interface BaseTeam {
  owner: string;
  name: string;
  /** Basic rider info used to look up results */
  riders: BaseRider[];
}

/** Team info without individual race results */
export interface Team {
  /** Team owner name */
  owner: string;
  /** Team name */
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
