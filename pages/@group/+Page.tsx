import { Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useData } from 'vike-react/useData';
import { Competition, type CompetitionProps } from '../../components/Competition/Competition.js';
import type { Group } from '../../common/types/Group.js';
import { spacing } from '../../components/theme.js';
import { baseUrl } from '../../common/constants.js';

const groups: Group[] = ['women', 'men'];

export function Page() {
  const data = useData<CompetitionProps>();
  if (!data) return null;

  return (
    <Stack spacing={spacing.general} alignItems="center">
      <Typography variant="h1">
        <em>Escape Collective</em> draft rankings
      </Typography>
      <TabContext value={data.group}>
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
        <TabPanel key={data.group} value={data.group}>
          <Competition {...data} />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}
