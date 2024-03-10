export interface Rider {
  name: string;
  /** Points for this year including sanctions */
  totalPoints?: number;
  /** Sanctions for this year */
  sanctions?: number;
  /** Race results for this year */
  results?: RaceResult[];
}

export interface RaceResult {
  name: string;
  date: string;
  points: number;
}
