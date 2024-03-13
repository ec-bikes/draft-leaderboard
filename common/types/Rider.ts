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

export interface RaceResult {
  name: string;
  date: string;
  points: number;
}
