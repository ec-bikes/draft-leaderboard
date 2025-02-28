import React from 'react';
import {
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import type { Team } from '../../common/types/Team';
import type { Group } from '../../common/types/Group';
import { getUciRiderUrl } from '../../common/uciUrls.js';
import { getPcsUrl } from '../../common/getPcsUrl.js';
import { spacing } from '../theme.js';
import type { RiderDialogProps } from '../RiderDialog/RiderDialog.js';

const LazyRiderDialog = React.lazy(() => import('../RiderDialog/RiderDialog.js'));

// Force points (2) and links (3) to specific widths and prevent wrapping
const RiderRow = styled(TableRow)({
  [`& td:nth-of-type(2)`]: { width: '62px', whiteSpace: 'nowrap' },
  [`& td:nth-of-type(3)`]: { width: '65px', whiteSpace: 'nowrap' },
});

export function TeamCardContent(props: {
  team: Team;
  rank: number;
  momentId: number;
  group: Group;
  year: number;
}) {
  const { team, rank, momentId, group, year } = props;
  const { tradedIn, tradedOut } = team;
  const [riderDialogProps, setRiderDialogProps] =
    React.useState<Omit<RiderDialogProps, 'onClose' | 'group'>>();

  const riders = [...team.riders].sort((a, b) => b.totalPoints - a.totalPoints);

  // const theme = useTheme();
  // const isExtraSmallSize = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Stack direction="column" spacing={spacing.teamCard.vertical}>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={spacing.teamCard.headerHorizontal}
      >
        <Stack
          textAlign="right"
          spacing={spacing.teamCard.rankingVertical}
          lineHeight="1.0"
          whiteSpace="nowrap"
          paddingLeft={1}
        >
          <span>
            <Typography variant="rankingPound">#</Typography>
            <Typography variant="rankingNumber">{rank}</Typography>
          </span>
          <Typography variant="rankingPointsCount">{Math.round(team.totalPoints)}</Typography>
          <Typography variant="rankingPointsText">points</Typography>
        </Stack>

        <Typography variant="h3">
          <Typography variant="teamOwner">
            {team.owner + (team.owner.endsWith('s') ? '’' : '’s')}
          </Typography>
          <br />
          <em>{team.name}</em>
        </Typography>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rider</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Links</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {riders.map((rider) => {
            const uciUrl = getUciRiderUrl({ individualId: rider.id, momentId, group });
            const pcsUrl = getPcsUrl({ name: rider.name, year });
            return (
              <RiderRow key={rider.name}>
                <TableCell>
                  {
                    <span
                      style={rider.name === tradedOut ? { textDecoration: 'line-through' } : {}}
                    >
                      {rider.name}
                    </span>
                  }
                  {rider.name === tradedIn && <Typography variant="tiny"> (trade)</Typography>}
                </TableCell>
                <TableCell>
                  <Link
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setRiderDialogProps({ teamOwner: team.owner, rider, uciUrl, pcsUrl })
                    }
                  >
                    {Math.round(rider.totalPoints)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography variant="tiny">
                    <Link target="_blank" href={uciUrl}>
                      UCI
                    </Link>
                    {', '}
                    <Link target="_blank" href={pcsUrl}>
                      PCS
                    </Link>
                  </Typography>
                </TableCell>
              </RiderRow>
            );
          })}
        </TableBody>
      </Table>
      {riderDialogProps && (
        <React.Suspense fallback={<></>}>
          <LazyRiderDialog
            {...riderDialogProps}
            group={group}
            onClose={() => setRiderDialogProps(undefined)}
          />
        </React.Suspense>
      )}
    </Stack>
  );
}
