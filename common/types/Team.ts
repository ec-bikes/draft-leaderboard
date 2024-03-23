import type { BaseRider, Rider, RiderDetails } from './Rider.js';

/** Basic team info used in the team definition files */
export interface BaseTeam {
  owner: string;
  name: string;
  /** Basic rider info used to look up results */
  riders: BaseRider[];
}

/** Team info without individual race results (used in `TeamsSummaryJson`) */
export interface Team {
  /** Team owner name */
  owner: string;
  /** Team name */
  name: string;
  /** Current points total */
  totalPoints: number;
  /** Rider summary data (no race results) */
  riders: Rider[];
}

/** Team details including individual race results (used in `TeamDetailsJson`) */
export interface TeamDetails extends Omit<Team, 'riders'> {
  /** Rider data with race results */
  riders: RiderDetails[];
}
