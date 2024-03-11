import { Container, Link, Stack } from '@mui/material';
import { TeamCards } from './components/TeamCards/TeamCards';
import _teamData from './data/teams.json';
import type { TeamsSummaryJson } from './types/Team';
import { getUciSeasonRankingUrl } from './data/uciUrls';
import { Box } from '@mui/system';

const { rankingDate, fetchedDate, momentId }: TeamsSummaryJson = _teamData;

function App() {
  return (
    <Container>
      <Box
        marginLeft="auto"
        marginRight="auto"
        marginTop={{ xs: 2, sm: 4, md: 8 }}
        marginBottom={{ xs: 2, sm: 4 }}
      >
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
              >
                Wheel Talk Podcast 2024 Draft
              </Link>
            </p>
            <p>
              Data from{' '}
              <Link target="_blank" href={getUciSeasonRankingUrl({ momentId })}>
                UCI rankings
              </Link>{' '}
              as of <strong>{rankingDate}</strong>{' '}
              <span style={{ fontSize: '0.8rem' }}>(retrieved at {fetchedDate})</span>
            </p>
          </div>
          {/* <a href="https://escapecollective.com/behold-our-mens-worldtour-draft-2024/">Men's teams</a> */}

          <TeamCards />
        </Stack>
      </Box>
    </Container>
  );
}

export default App;
