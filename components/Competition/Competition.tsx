import { Link, Stack, Typography } from '@mui/material';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { Group } from '../../common/types/Group';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';
import { spacing } from '../theme.js';
import type { TeamsSummaryJson } from '../../common/types/TeamJson.js';
import type { Draft } from '../../common/types/Draft.js';
import { formatDate } from '../../scripts/data/formatDate.js';

export interface CompetitionProps extends Draft {
  group: Group;
  teamData: TeamsSummaryJson;
}

export function Competition(props: CompetitionProps) {
  const { group, podcast, link, teamData, tradeDate } = props;
  const { source } = teamData;

  return (
    <Stack gap={spacing.general} alignItems="center">
      <Typography variant="description">
        <Link target="_blank" href={link}>
          <em>{podcast}</em> podcast draft team
        </Link>{' '}
        rankings, based on{' '}
        {source === 'uci' ? (
          <Link
            target="_blank"
            href={getUciSeasonRankingUrl({ momentId: teamData.momentId, group })}
          >
            UCI points
          </Link>
        ) : (
          <>UCI points (via PCS)</>
        )}{' '}
        as of <strong>{source === 'uci' ? teamData.rankingDate : teamData.fetchedDate}</strong>.
        {tradeDate && (
          <>
            <br /> Includes trades effective {formatDate(new Date(tradeDate), 'short')}.
          </>
        )}
      </Typography>

      <TeamCards teamData={teamData} group={group} />
    </Stack>
  );
}
