import type { Rider, RiderDetails } from './Rider.js';

/** Basic team info used in the team definition files */
export interface BaseTeam {
  /** Team owner name */
  owner: string;
  /** Team name */
  name: string;
  /** Rider names used to look up IDs and results */
  riders: string[];
  /** Rider name traded in */
  tradedIn?: string;
  /** Rider name traded out */
  tradedOut?: string;
}

/** Team info without individual race results (used in `TeamsSummaryJson`) */
export interface Team extends Pick<BaseTeam, 'owner' | 'name' | 'tradedIn' | 'tradedOut'> {
  /** Current points total */
  totalPoints: number;
  /** Rider summary data (no race results) */
  riders: Rider[];
  /**
   * Ranking movement since a week ago (filled in by `updateHistory`).
   * This is optional because old files may not have it.
   */
  movement?: number;
}

/** Team details including individual race results (used in `TeamDetailsJson`) */
export interface TeamDetails extends Omit<Team, 'riders'> {
  /** Rider data with race results */
  riders: RiderDetails[];
}

/** Mapping from real team 3-letter code to real team name */
export interface UciTeamNames {
  [teamCode: string]: string;
}
