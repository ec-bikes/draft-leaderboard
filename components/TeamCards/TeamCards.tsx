import { Card, CardContent, Grid } from '@mui/material';
import { TeamCardContent } from './TeamCardContent.js';
import type { Group } from '../../common/types/Group';
import { spacing } from '../theme.js';
import type { TeamsSummaryJson } from '../../common/types/TeamJson.js';

export function TeamCards(props: { teamData: TeamsSummaryJson; group: Group }) {
  const { teamData } = props;
  const teams = [...teamData.teams].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <Grid container spacing={spacing.general}>
      {teams.map((team, i) => (
        // number is colspan (out of 12)
        <Grid key={team.owner} item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <TeamCardContent
                team={team}
                rank={i + 1}
                momentId={teamData.momentId}
                group={props.group}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
