import type { Draft } from './Draft.js';
import type { TeamsSummaryJson } from './TeamJson.js';

/** Data as passed to client by `pages/@group/+data.ts` */
export interface ClientData {
  teamData: TeamsSummaryJson;
  draft: Draft;
}
