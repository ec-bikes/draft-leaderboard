## Regularly updated files

<!-- prettier-ignore -->
| Filename | Description | Updated by |
| -------- | ----------- | ---------- |
| `[group]-[year]/summary.json` | Current team and rider points summary | `updateData` |
| `[group]-[year]/previous/summary-[YYYY-MM-DD].json` | Previous team and rider points summary | `updateData` |
| `[group]-[year]/details/[ownerFirstName].json` | Detailed rider results per team | `updateData` |
| `[group]-[year]/history.json` | History of team points totals on different dates | `updateData` regularly; `fillHistory` to backfill from summary files; `fillPreviousSummary` to add one week prior to start |

## Manually updated files

<!-- prettier-ignore -->
| Filename | Description | Updated by |
| -------- | ----------- | ---------- |
| `[group]sRiders.ts` | Mapping from rider names (top 200-300) to UCI object IDs | `getRiders` (see args), manually correcting casing and adding variants for preferred names |
| `[group]-[year]/draft.ts` | Draft teams for each year | manual |
| `[group]-[year]/riders.json` | Raw rider rankings and details from UCI (not committed) | `getRiders` (see args) |
| `[group]-[year]/uciTeams.json` | Data about riders' teams for this year and their nationality, and mapping from team abbreviation to name | `getTeamData` with manual corrections of team name casing |
