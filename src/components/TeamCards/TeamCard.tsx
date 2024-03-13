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
import type { Team } from '../../../common/types/Team';
import type { Group } from '../../../common/types/Group';
import { getUciRiderUrl } from '../../../common/uciUrls.js';
import { getPcsUrl } from '../../../common/getPcsUrl.js';

// orange #FF6F42

const CompactTableCell = styled(TableCell)(({ theme }) => ({
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 'bold',
  },
}));

function PointsNumber(props: { rank: number; points: number }) {
  return (
    <Stack
      textAlign="right"
      gap="3px"
      useFlexGap
      lineHeight="1.0"
      whiteSpace="nowrap"
      // height="97px"
      // justifyContent="center"
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
      {Math.round(props.points)}
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
            fontSize="1.3rem"
          >
            <PointsNumber rank={rank} points={Math.round(team.totalPoints)} />
            <div style={{ lineHeight: '1.3' }}>
              <span style={{ fontWeight: '500' }}>
                {team.owner + (team.owner.endsWith('s') ? '’' : '’s')}
              </span>
              <br />
              <em
                style={
                  team.name.startsWith('DSM') ? { fontSize: '1.1rem', display: 'inline-block' } : {}
                }
              >
                {team.name}
              </em>
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
                    {Math.round(rider.totalPoints)}
                  </CompactTableCell>
                  <CompactTableCell style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
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
