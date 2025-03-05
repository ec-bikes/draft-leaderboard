import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography } from '@mui/material';
import { useData } from 'vike-react/useData';
import { groups } from '../../common/constants.js';
import { getPageUrl } from '../../common/pageUrls.js';
import type { DraftData } from '../../common/types/index.js';
import { Competition } from '../../components/Competition/Competition.js';
import { spacing } from '../../components/theme.js';

export function Page() {
  const { group, year } = useData<DraftData>();

  return (
    <Stack spacing={spacing.page.vertical} alignItems="center">
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
          <Competition />
        </TabPanel>
      </TabContext>
    </Stack>
  );
}
