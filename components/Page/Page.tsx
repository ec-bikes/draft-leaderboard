import { Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useData } from 'vike-react/useData';
import { Competition, type CompetitionProps } from '../Competition/Competition.js';
import { spacing } from '../theme.js';
import { groups } from '../../common/constants.js';
import { getPageUrl } from '../../common/pageUrls.js';

export function Page() {
  const data = useData<CompetitionProps>();
  if (!data) return null;

  const { group, year } = data;

  return (
    <Stack spacing={spacing.general} alignItems="center">
      <Typography variant="h1">
        <em>Escape Collective</em> {year} draft rankings
      </Typography>
      <TabContext value={group}>
        <TabList aria-label="draft groups">
          {groups.map((grp) => (
            <Tab
              key={grp}
              href={getPageUrl(grp, year)}
              label={grp[0].toUpperCase() + grp.slice(1)}
              value={grp}
            />
          ))}
        </TabList>
        <TabPanel key={group} value={group}>
          <Competition {...data} />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}
