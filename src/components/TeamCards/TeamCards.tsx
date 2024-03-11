import {
  Card,
  CardContent,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import _teamData from '../../data/teams.json';
import type { Team, TeamsSummaryJson } from '../../types/Team';
import { getUciRiderUrl } from '../../data/uciUrls';
import { getPcsUrl } from '../../data/getPcsUrl';

const teamData: TeamsSummaryJson = _teamData;
const teams = [...teamData.teams].sort((a, b) => b.totalPoints - a.totalPoints);

// orange #FF6F42

const CompactTableCell = styled(TableCell)(({ theme }) => ({
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 'bold',
  },
}));

function TeamCard(props: { team: Team; rank: number }) {
  const { team, rank } = props;
  const riders = [...team.riders].sort((a, b) => b.totalPoints - a.totalPoints);

  // const theme = useTheme();
  // const isExtraSmallSize = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Card>
      <CardContent>
        <Stack direction="column" gap={2} useFlexGap>
          <Stack
            direction="row"
            useFlexGap
            justifyContent="flex-start"
            alignItems="center"
            spacing={{ xs: 2.5, sm: 3 }}
            fontSize="1.3rem"
          >
            <Stack textAlign="right" gap="3px" useFlexGap lineHeight="1.0" whiteSpace="nowrap">
              <span>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '1.5rem',
                    paddingRight: 4,
                    paddingTop: 6,
                    verticalAlign: 'top',
                  }}
                >
                  #
                </span>
                <strong style={{ fontSize: '2.5rem' }}>{rank}</strong>
              </span>
              {team.totalPoints}
              <span style={{ fontSize: '1rem' }}>points</span>
            </Stack>
            <div style={{ lineHeight: '1.3' }}>
              <span style={{ fontWeight: '500' }}>
                {team.owner + (team.owner.endsWith('s') ? '’' : '’s')}
              </span>
              <br />
              <em>{team.name}</em>
            </div>
          </Stack>
          <Table size="small" width="100%">
            <TableHead>
              <TableRow sx={{ fontWeight: 'bold' }}>
                <CompactTableCell>Rider</CompactTableCell>
                <CompactTableCell>Points</CompactTableCell>
                <CompactTableCell>Links</CompactTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riders.map((rider) => (
                <TableRow key={rider.name}>
                  <CompactTableCell>{rider.name}</CompactTableCell>
                  <CompactTableCell style={{ whiteSpace: 'nowrap' }}>
                    {rider.totalPoints}
                  </CompactTableCell>
                  <CompactTableCell style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    <Link
                      target="_blank"
                      href={getUciRiderUrl({ individualId: rider.id, momentId: teamData.momentId })}
                    >
                      UCI
                    </Link>
                    ,{' '}
                    <Link target="_blank" href={getPcsUrl(rider)}>
                      PCS
                    </Link>
                  </CompactTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function TeamCards() {
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
          <TeamCard team={team} rank={i + 1} />
        </Grid>
      ))}
    </Grid>
  );
}
