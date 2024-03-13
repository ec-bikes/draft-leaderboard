import { Link, Stack, Typography } from '@mui/material';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { TeamsSummaryJson } from '../../common/types/Team';
import type { Group } from '../../common/types/Group';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';

export function Competition(props: {
  group: Group;
  title: string;
  name: string;
  link: string;
  teamData: TeamsSummaryJson;
}) {
  const { group, title, name, link, teamData } = props;

  return (
    <Stack gap={4} useFlexGap alignItems="center">
      <Typography variant="h2">{title}</Typography>

      <div style={{ textAlign: 'center' }}>
        Teams from Escape Collective’s{' '}
        <Link target="_blank" href={link}>
          {name}
        </Link>
        .
        <br />
        Data from{' '}
        <Link target="_blank" href={getUciSeasonRankingUrl({ momentId: teamData.momentId, group })}>
          UCI rankings
        </Link>{' '}
        as of <strong>{teamData.rankingDate}</strong>{' '}
        <span style={{ fontSize: '0.8rem' }}>(retrieved {teamData.fetchedDate}).</span>
      </div>

      <TeamCards teamData={teamData} group={group} />
    </Stack>
  );
}
