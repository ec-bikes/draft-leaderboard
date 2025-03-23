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
import React from 'react';
import { useData } from 'vike-react/useData';
import { getPcsUrl } from '../../common/getPcsUrl.js';
import type { DraftData, Team } from '../../common/types/index';
import { getUciRiderUrl } from '../../common/uciUrls.js';
import { Country } from '../Country/Country.js';
import type { RiderDialogProps } from '../RiderDialog/RiderDialog.js';
import { spacing } from '../theme.js';
import { TeamCardHeader } from './TeamCardHeader.js';

const LazyRiderDialog = React.lazy(() => import('../RiderDialog/RiderDialog.js'));

// Force points (2) and links (3) to specific widths (intepreted as minimums if content overflows)
// and prevent wrapping
const RiderTableRow = styled(TableRow)({
  [`& td:nth-of-type(2)`]: { width: '60px', whiteSpace: 'nowrap' },
  [`& td:nth-of-type(3)`]: { width: '65px', whiteSpace: 'nowrap' },
});

/** A slightly wider space (NOT a normal space character) */
const enSpace = ' ';

export function TeamCardContent(props: { team: Team; rank: number }) {
  const { team, rank } = props;
  const { momentId, group, year } = useData<DraftData>();
  const [riderForDialog, setRiderForDialog] = React.useState<RiderDialogProps['rider']>();
  const { uciTeamNames } = useData<DraftData>();

  const riders = [...team.riders]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((rider) => ({
      ...rider,
      uciUrl: getUciRiderUrl({ individualId: rider.id, momentId, group }),
      pcsUrl: getPcsUrl({ name: rider.name, year }),
    }));

  // const theme = useTheme();
  // const isExtraSmallSize = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Stack direction="column" spacing={spacing.teamCard.vertical}>
      <TeamCardHeader team={team} rank={rank} />
      <Table aria-label={`Points by rider for ${team.name}`}>
        <TableHead>
          <TableRow>
            <TableCell>Rider</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Links</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {riders.map((rider) => (
            <RiderRow
              key={rider.name}
              rider={rider}
              onOpenDialog={() => setRiderForDialog(rider)}
              uciTeamNames={uciTeamNames}
            />
          ))}
        </TableBody>
      </Table>
      {riderForDialog && (
        <React.Suspense fallback={<></>}>
          <LazyRiderDialog
            rider={riderForDialog}
            teamOwner={team.owner}
            onClose={() => setRiderForDialog(undefined)}
          />
        </React.Suspense>
      )}
    </Stack>
  );
}

function RiderRow(
  props: Pick<DraftData, 'uciTeamNames'> & {
    rider: RiderDialogProps['rider'];
    onOpenDialog: () => void;
  },
) {
  const { rider, onOpenDialog, uciTeamNames } = props;

  const uciTeamName = !!rider.team && uciTeamNames?.[rider.team];

  return (
    <RiderTableRow>
      <TableCell>
        <span style={rider.tradedOut ? { textDecoration: 'line-through' } : undefined}>
          {rider.country && (
            <>
              <Country flagOnly country={rider.country} />
              {enSpace}
            </>
          )}
          {rider.name}
          {uciTeamName && (
            <>
              {' '}
              <Typography variant="tiny" component="em" title={uciTeamName}>
                ({rider.team})
              </Typography>
            </>
          )}
        </span>
        {rider.tradedIn && <Typography variant="tiny"> (trade)</Typography>}
      </TableCell>
      <TableCell>
        <Link component="button" type="button" onClick={onOpenDialog}>
          {Math.round(rider.totalPoints)}
        </Link>
      </TableCell>
      <Typography variant="tiny" component={TableCell as any /*props don't line up, but it works*/}>
        <Link target="_blank" href={rider.uciUrl}>
          UCI
        </Link>
        {', '}
        <Link target="_blank" href={rider.pcsUrl}>
          PCS
        </Link>
      </Typography>
    </RiderTableRow>
  );
}
