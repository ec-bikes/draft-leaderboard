import React from 'react';
import { Stack, Tab, Typography, styled } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { usePageContext } from 'vike-react/usePageContext';
import type { Data } from './+data.js';
import { Competition, type CompetitionProps } from '../../components/Competition/Competition.js';
import type { Group } from '../../common/types/Group.js';

export const title = 'Draft leaderboard';

const drafts: Record<Group, Omit<CompetitionProps, 'teamData' | 'group'>> = {
  women: {
    podcast: 'Wheel Talk',
    link: 'https://escapecollective.com/the-wheel-talk-podcast-2024-draft/',
  },
  men: {
    podcast: 'Placeholders',
    link: 'https://escapecollective.com/behold-our-mens-worldtour-draft-2024/',
  },
};

const DraftTab = styled(Tab)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '1.5rem',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
}));

export function Page() {
  const teamData = usePageContext().data as Data;
  const [value, setValue] = React.useState<Group>('women');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue as Group);
  };

  return (
    <Stack gap={{ xs: 2, sm: 4 }} alignItems="center">
      <Typography variant="h1">Escape Collective draft rankings</Typography>
      <TabContext value={value}>
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
        <TabList onChange={handleChange} aria-label="draft group">
          {Object.keys(drafts).map((group) => (
            <DraftTab key={group} label={group} value={group} />
          ))}
        </TabList>
        {/* </Box> */}
        {Object.entries(drafts).map(([group, draft]) => (
          <TabPanel key={group} value={group} sx={{ padding: 0 }}>
            <Competition group={group as Group} {...draft} teamData={teamData[group as Group]} />
          </TabPanel>
        ))}
      </TabContext>
    </Stack>
  );
}
