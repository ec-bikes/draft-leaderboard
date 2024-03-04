export interface RawRider {
  name: string;
  id: number;
  searchName?: string;
  pcsName?: string;
}

export interface RawTeam {
  owner: string;
  name: string;
  /** basic rider data (not including full results) */
  riders: RawRider[];
}
