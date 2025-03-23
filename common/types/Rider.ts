/** Basic rider info used in the team definition files, and as a base for other rider info types. */
export interface BaseRider {
  /** Displayed name */
  name: string;
  /** Partial UCI ID used to look up the rider in the UCI APIs */
  id: number;
  tradedIn?: boolean;
  tradedOut?: boolean;
  /** Number of sanction points the rider had as of the trade date */
  sanctionsAtTrade?: number;
}

/** Rider info which was added later and is saved separately */
export interface ExtraRiderInfo {
  /** Two-letter country code (missing in 2024) */
  country: string;
  /** Three-letter code for the rider's real team (missing in 2024) */
  team: string;
}

/** Rider info without race results, but with team/country info if available */
export interface Rider extends BaseRider, Partial<ExtraRiderInfo> {
  /** Points for this year including sanctions */
  totalPoints: number;
  /** Sanctions for this year */
  sanctions?: number;
}

/** Rider info including race results */
export interface RiderDetails extends Rider {
  /** Race results for this year */
  results: RaceResult[];
}

/** Race result for a rider */
export interface RaceResult {
  /** Race or sub-result name */
  name: string;
  /** Display date e.g. "22 Mar 2024" */
  date: string;
  points: number;
  rank?: number;
}
