import { Card, CardContent, Grid2 as Grid, useTheme } from '@mui/material';
import { TeamCardContent } from './TeamCardContent.js';
import type { Group } from '../../common/types/Group';
import { spacing } from '../theme.js';
import type { TeamsSummaryJson } from '../../common/types/TeamJson.js';

// number is colspan (out of 12)
const gridSizes = { xs: 12, sm: 6, md: 4 };

export function TeamCards(props: { teamData: TeamsSummaryJson; group: Group; year: number }) {
  const { teamData, ...rest } = props;
  const teams = [...teamData.teams].sort((a, b) => b.totalPoints - a.totalPoints);
  const theme = useTheme();

  return (
    <Grid container spacing={spacing.teamCardsGrid}>
      {teams.map((team, i) => (
        <Grid key={team.owner} size={gridSizes}>
          <Card>
            <CardContent
              // The default padding is 2spc other sides, 3spc bottom. Reducing it looks better.
              // (sx padding isn't working here for some reason)
              style={{ paddingBottom: theme.spacing(2.5) }}
            >
              <TeamCardContent team={team} rank={i + 1} momentId={teamData.momentId} {...rest} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
