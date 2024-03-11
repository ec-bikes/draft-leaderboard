import { Link, Stack } from '@mui/material';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { TeamsSummaryJson } from '../../types/Team';
import { getUciSeasonRankingUrl } from '../../data/uciUrls';
import { useData } from '../../renderer/useData.js';

export const title = 'Wheel Talk draft rankings';

// eslint-disable-next-line react-refresh/only-export-components
export function data(): Promise<TeamsSummaryJson> {
  // create a split point
  return import('../../data/teams.json');
}

export function Page() {
  const teamData = useData<TeamsSummaryJson>();
  return (
    <Stack gap={4} useFlexGap alignItems="center">
      <h1 style={{ margin: 0, textAlign: 'center', fontSize: '3.2rem', lineHeight: '1.1' }}>
        Wheel Talk draft rankings
      </h1>
      <div style={{ textAlign: 'center' }}>
        <p>
          Teams from Escape Collective’s{' '}
          <Link
            target="_blank"
            href="https://escapecollective.com/the-wheel-talk-podcast-2024-draft/"
            // men's teams:
            // https://escapecollective.com/behold-our-mens-worldtour-draft-2024/"
          >
            Wheel Talk Podcast 2024 Draft
          </Link>
        </p>
        <p>
          Data from{' '}
          <Link target="_blank" href={getUciSeasonRankingUrl({ momentId: teamData.momentId })}>
            UCI rankings
          </Link>{' '}
          as of <strong>{teamData.rankingDate}</strong>{' '}
          <span style={{ fontSize: '0.8rem' }}>(retrieved at {teamData.fetchedDate})</span>
        </p>
      </div>

      <TeamCards teamData={teamData} />
    </Stack>
  );
}
