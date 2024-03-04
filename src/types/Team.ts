import type { Rider } from './Rider';

export interface Team {
  owner: string;
  name: string;
  totalPoints: number;
  issues: string[];
  riders: Rider[];
}
