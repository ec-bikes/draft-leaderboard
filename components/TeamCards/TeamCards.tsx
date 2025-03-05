import { Card, CardContent, Grid2 as Grid } from '@mui/material';
import { useData } from 'vike-react/useData';
import { DraftData } from '../../common/types/index.js';
import { spacing } from '../theme.js';
import { TeamCardContent } from './TeamCardContent.js';

// number is colspan (out of 12)
const gridSizes = { xs: 12, sm: 6, md: 4 };

export function TeamCards() {
  const data = useData<DraftData>();
  const teams = [...data.teams].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <Grid container spacing={spacing.teamCardsGrid}>
      {teams.map((team, i) => (
        <Grid key={team.owner} size={gridSizes}>
          <Card>
            <CardContent>
              <TeamCardContent team={team} rank={i + 1} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
