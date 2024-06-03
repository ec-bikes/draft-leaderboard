import React from 'react';
import { Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useData } from 'vike-react/useData';
import { usePageContext } from 'vike-react/usePageContext';
import { Competition } from '../../components/Competition/Competition.js';
import type { Group } from '../../common/types/Group.js';
import { spacing } from '../../components/theme.js';
import { baseUrl } from '../../common/constants.js';
import type { Data } from './+data.js';

const groups: Group[] = ['women', 'men'];

export function Page() {
  const pageContext = usePageContext();
  const selectedGroup = pageContext.routeParams?.group as Group | undefined;
  const data = useData<Data>();

  if (!selectedGroup || !data) return null;

  return (
    <Stack spacing={spacing.general} alignItems="center">
      <Typography variant="h1">
        <em>Escape Collective</em> draft rankings
      </Typography>
      <TabContext value={selectedGroup}>
        <TabList aria-label="draft groups">
          {groups.map((group) => (
            <Tab
              key={group}
              href={baseUrl + group}
              label={group[0].toUpperCase() + group.slice(1)}
              value={group}
            />
          ))}
        </TabList>
        <TabPanel key={selectedGroup} value={selectedGroup}>
          <Competition group={selectedGroup} {...data} />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}
