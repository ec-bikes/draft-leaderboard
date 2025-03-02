/** History of team points totals on different dates */
export interface PointsHistory {
  /** YYYY-MM-DD dates, in ascending order. */
  dates: string[];
  /** Mapping from team owner name to points totals for each date in `dates (oldest first). */
  teams: Record<string, number[]>;
}
