export interface RawRider {
  /** Displayed name */
  name: string;
  /** Partial UCI ID used to look up the rider in the UCI APIs */
  id: number;
  /** Alternative name to use in the UCI search API */
  searchName?: string;
}

export interface RawTeam {
  owner: string;
  name: string;
  /** Basic rider info used to look up results */
  riders: RawRider[];
}
