import type { Group } from './Group.js';
import type { BaseTeam } from './Team.js';

export interface Draft {
  group: Group;
  year: number;
  podcast: string;
  link?: string;
  /** Date of trades, YYYY-MM-DD */
  tradeDate?: string;
  /** Extra note shown below the main description */
  extraNote?: string;
  teams: BaseTeam[];
}
