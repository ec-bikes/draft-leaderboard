import type { Draft } from './Draft.js';
import type { UciTeamNames } from './Team.js';
import type { TeamsSummaryJson } from './TeamJson.js';

/**
 * Draft and team data (summary.json) for the page currently being rendered.
 * This is passed to client by `pages/@group/+data.ts` and accessed with `useData()`.
 */
export interface DraftData extends Draft, TeamsSummaryJson {
  /** Team names, unavaialble for 2024 */
  uciTeamNames?: UciTeamNames;
}
