import { Link, Stack } from '@mui/material';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { TeamsSummaryJson } from '../../common/types/Team';
import type { Group } from '../../common/types/Group';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';

export interface CompetitionProps {
  group: Group;
  podcast: string;
  link: string;
  teamData: TeamsSummaryJson;
}

export function Competition(props: CompetitionProps) {
  const { group, podcast, link, teamData } = props;

  return (
    <Stack gap={4} useFlexGap alignItems="center">
      <div style={{ textAlign: 'center', fontSize: '1.1rem', lineHeight: '1.7' }}>
        Teams from the{' '}
        <Link target="_blank" href={link}>
          {podcast} podcast 2024 draft
        </Link>
        .
        <br />
        Data from{' '}
        <Link target="_blank" href={getUciSeasonRankingUrl({ momentId: teamData.momentId, group })}>
          UCI rankings
        </Link>{' '}
        as of <strong>{teamData.rankingDate}</strong>.
        <br />
        <span style={{ fontSize: '0.9rem' }}>(retrieved {teamData.fetchedDate})</span>
      </div>

      <TeamCards teamData={teamData} group={group} />
    </Stack>
  );
}
