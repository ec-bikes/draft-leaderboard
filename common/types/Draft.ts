import type { Group } from './Group.js';
import type { BaseTeam } from './Team.js';

export interface Draft {
  group: Group;
  year: number;
  podcast: string;
  link?: string;
  /** Date of trades, YYYY-MM-DD */
  tradeDate?: string;
  teams: BaseTeam[];
}
