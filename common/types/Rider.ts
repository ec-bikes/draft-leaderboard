/** Basic rider info used in the team definition files, and as a base for other rider info types. */
export interface BaseRider {
  /** Displayed name */
  name: string;
  /** Partial UCI ID used to look up the rider in the UCI APIs */
  id: number;
}

/** Rider info without race results */
export interface Rider extends BaseRider {
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
  /** Display date e.g. "22 March 2024" */
  dateStr: string;
  /** Date, 00:00 UTC */
  date: number;
  points: number;
}
