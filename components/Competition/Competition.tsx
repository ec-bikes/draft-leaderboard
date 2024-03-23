import { Link, Stack, Typography } from '@mui/material';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { Group } from '../../common/types/Group';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';
import { spacing } from '../theme.js';
import type { TeamsSummaryJson } from '../../common/types/TeamJson.js';

export interface CompetitionProps {
  group: Group;
  podcast: string;
  link: string;
  teamData: TeamsSummaryJson;
}

export function Competition(props: CompetitionProps) {
  const { group, podcast, link, teamData } = props;

  return (
    <Stack gap={spacing.general} alignItems="center">
      <Typography variant="description">
        <Link target="_blank" href={link}>
          <em>{podcast}</em> podcast draft team
        </Link>{' '}
        rankings, based on{' '}
        <Link target="_blank" href={getUciSeasonRankingUrl({ momentId: teamData.momentId, group })}>
          UCI rankings
        </Link>{' '}
        as of <strong>{teamData.rankingDateStr}</strong>.
      </Typography>

      <TeamCards teamData={teamData} group={group} />
    </Stack>
  );
}
