import { Divider, Link, Stack, useTheme } from '@mui/material';
import { usePageContext } from 'vike-react/usePageContext';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { TeamsSummaryJson } from '../../../common/types/Team';
import type { Group } from '../../../common/types/Group';
import type { Data } from './+data.js';
import { getUciSeasonRankingUrl } from '../../../common/uciUrls.js';

export const title = 'Draft leaderboard';

function Section(props: {
  group: Group;
  title: string;
  name: string;
  link: string;
  teamData: TeamsSummaryJson;
}) {
  const { group, title, name, link, teamData } = props;

  return (
    <>
      <h2
        style={{
          margin: 0,
          textAlign: 'center',
          fontSize: '3.2rem',
          lineHeight: '1.1',
        }}
      >
        {title}
      </h2>

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
    </>
  );
}

export function Page() {
  const teamData = usePageContext().data as Data;
  const theme = useTheme();

  return (
    <Stack gap={4} useFlexGap alignItems="center">
      <Section
        group="women"
        title="Wheel Talk draft rankings"
        name="Wheel Talk podcast 2024 draft"
        link="https://escapecollective.com/the-wheel-talk-podcast-2024-draft/"
        teamData={teamData.women}
      />
      <Divider flexItem sx={{ marginTop: theme.spacing(2) }} />
      <Section
        group="men"
        title="Placeholders draft rankings"
        name="Placeholders podcast 2024 draft"
        link="https://escapecollective.com/behold-our-mens-worldtour-draft-2024/"
        teamData={teamData.men}
      />
    </Stack>
  );
}
