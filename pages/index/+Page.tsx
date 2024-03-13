import { Divider, Stack, useTheme } from '@mui/material';
import { usePageContext } from 'vike-react/usePageContext';
import type { Data } from './+data.js';
import { Competition } from '../../components/Competition/Competition.js';

export const title = 'Draft leaderboard';

export function Page() {
  const teamData = usePageContext().data as Data;
  const theme = useTheme();

  return (
    <Stack gap={4} divider={<Divider sx={{ marginTop: theme.spacing(2) }} />}>
      <Competition
        group="women"
        title="Wheel Talk draft rankings"
        name="Wheel Talk podcast 2024 draft"
        link="https://escapecollective.com/the-wheel-talk-podcast-2024-draft/"
        teamData={teamData.women}
      />
      <Competition
        group="men"
        title="Placeholders draft rankings"
        name="Placeholders podcast 2024 draft"
        link="https://escapecollective.com/behold-our-mens-worldtour-draft-2024/"
        teamData={teamData.men}
      />
    </Stack>
  );
}
