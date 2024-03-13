import { Grid } from '@mui/material';
import type { TeamsSummaryJson } from '../../../common/types/Team';
import { TeamCard } from './TeamCard.js';
import type { Group } from '../../../common/types/Group';

export function TeamCards(props: { teamData: TeamsSummaryJson; group: Group }) {
  const { teamData } = props;
  const teams = [...teamData.teams].sort((a, b) => b.totalPoints - a.totalPoints);
  // xs, extra-small: 0px
  // sm, small: 600px
  // md, medium: 900px
  // lg, large: 1200px
  // xl, extra-large: 1536px
  return (
    <Grid container spacing={{ xs: 2, sm: 4 }}>
      {teams.map((team, i) => (
        // number is colspan (out of 12)
        <Grid key={team.owner} item xs={12} sm={6} md={4}>
          <TeamCard team={team} rank={i + 1} momentId={teamData.momentId} group={props.group} />
        </Grid>
      ))}
    </Grid>
  );
}
