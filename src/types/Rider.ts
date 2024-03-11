/** Rider info without race results */
export interface Rider {
  name: string;
  /** ID used for UCI queries and URLs */
  id: number;
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
