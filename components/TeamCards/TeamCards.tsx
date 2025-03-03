import { Card, CardContent, Grid2 as Grid } from '@mui/material';
import { TeamCardContent } from './TeamCardContent.js';
import type { Group } from '../../common/types/Group';
import { spacing } from '../theme.js';
import type { TeamsSummaryJson } from '../../common/types/TeamJson.js';

// number is colspan (out of 12)
const gridSizes = { xs: 12, sm: 6, md: 4 };

export function TeamCards(props: { teamData: TeamsSummaryJson; group: Group; year: number }) {
  const { teamData, ...rest } = props;
  const teams = [...teamData.teams].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <Grid container spacing={spacing.general}>
      {teams.map((team, i) => (
        <Grid key={team.owner} size={gridSizes}>
          <Card>
            <CardContent>
              <TeamCardContent team={team} rank={i + 1} momentId={teamData.momentId} {...rest} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
