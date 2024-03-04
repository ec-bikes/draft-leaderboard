export interface Rider {
  name: string;
  /** Points excluding sanctions */
  totalPoints?: number;
  /** 12-month rolling sanctions (probably) */
  sanctions12Mo?: number;
  /** Sanctions from 2023 */
  sanctions2023?: number;
  results?: RaceResult[];
}

export interface RaceResult {
  name: string;
  date: string;
  points: number;
}
