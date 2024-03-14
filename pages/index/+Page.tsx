import React from 'react';
import { Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { usePageContext } from 'vike-react/usePageContext';
import type { Data } from './+data.js';
import { Competition, type CompetitionProps } from '../../components/Competition/Competition.js';
import type { Group } from '../../common/types/Group.js';
import { spacing } from '../../components/theme.js';

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

export function Page() {
  const teamData = usePageContext().data as Data;
  const [value, setValue] = React.useState<Group>('women');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue as Group);
  };

  return (
    <Stack spacing={spacing.general} alignItems="center">
      <Typography variant="h1">Escape Collective draft rankings</Typography>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="draft groups">
          {Object.keys(drafts).map((group) => (
            <Tab key={group} label={group[0].toUpperCase() + group.slice(1)} value={group} />
          ))}
        </TabList>
        {Object.entries(drafts).map(([group, draft]) => (
          <TabPanel key={group} value={group}>
            <Competition group={group as Group} {...draft} teamData={teamData[group as Group]} />
          </TabPanel>
        ))}
      </TabContext>
    </Stack>
  );
}
