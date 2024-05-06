import type { Team, TeamDetails } from './Team.js';

interface TeamJsonUciMetadata {
  source: 'uci';
  /** UCI ranking momentId for further requests */
  momentId: number;
  /** UCI ranking date (display-friendly) */
  rankingDate: string;
}

interface TeamJsonPcsMetadata {
  source: 'pcs';
  /** used to link to most recent UCI rankings */
  momentId: 0;
}

/** Ranking and fetch dates for team data */
export type TeamJsonMetadata = {
  schemaVersion: 1;
  /** Data fetch date (display-friendly, not for parsing) */
  fetchedDate: string;
} & (TeamJsonUciMetadata | TeamJsonPcsMetadata);

/** Short data about all the teams (no individual race results) */
export type TeamsSummaryJson = TeamJsonMetadata & {
  teams: Team[];
};

/** Data about a team including individual race results */
export type TeamDetailsJson = TeamJsonMetadata & {
  team: TeamDetails;
};
