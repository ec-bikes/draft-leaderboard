import {
  Card,
  CardContent,
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
import type { Team } from '../../common/types/Team';
import type { Group } from '../../common/types/Group';
import { getUciRiderUrl } from '../../common/uciUrls.js';
import { getPcsUrl } from '../../common/getPcsUrl.js';

const RiderTable = styled(Table)(({ theme }) => ({
  width: '100%',
  [`& .${tableCellClasses.root}`]: {
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  },
  [`& .${tableCellClasses.head}`]: {
    fontWeight: 'bold',
  },
}));
const RiderRow = styled(TableRow)({
  // don't wrap the points count
  '&:nth-child(2)': { whiteSpace: 'nowrap' },
  // make the links smaller and don't wrap
  '&:nth-child(3)': { fontSize: '0.7rem', whiteSpace: 'nowrap' },
});

const TeamName = styled('h3')({
  fontSize: '1.3rem',
  lineHeight: '1.3',
  fontWeight: 'normal',
  margin: 0,
});

function PointsNumber(props: { rank: number; points: number }) {
  return (
    <Stack
      textAlign="right"
      gap="3px"
      useFlexGap
      lineHeight="1.0"
      whiteSpace="nowrap"
      paddingLeft={1}
    >
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
        <strong style={{ fontSize: '2.5rem' }}>{props.rank}</strong>
      </span>
      <span style={{ fontSize: '1.3rem' }}>{Math.round(props.points)}</span>
      <span style={{ fontSize: '1rem' }}>points</span>
    </Stack>
  );
}

export function TeamCard(props: { team: Team; rank: number; momentId: number; group: Group }) {
  const { team, rank, momentId, group } = props;
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
          >
            <PointsNumber rank={rank} points={Math.round(team.totalPoints)} />
            <TeamName>
              <span style={{ fontWeight: '500' }}>
                {team.owner + (team.owner.endsWith('s') ? '’' : '’s')}
              </span>
              <br />
              <em>{team.name}</em>
            </TeamName>
          </Stack>
          <RiderTable size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rider</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Links</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riders.map((rider) => (
                <RiderRow key={rider.name}>
                  <TableCell>{rider.name}</TableCell>
                  <TableCell>{Math.round(rider.totalPoints)}</TableCell>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={getUciRiderUrl({ individualId: rider.id, momentId, group })}
                    >
                      UCI
                    </Link>
                    ,{' '}
                    <Link target="_blank" href={getPcsUrl(rider)}>
                      PCS
                    </Link>
                  </TableCell>
                </RiderRow>
              ))}
            </TableBody>
          </RiderTable>
        </Stack>
      </CardContent>
    </Card>
  );
}
