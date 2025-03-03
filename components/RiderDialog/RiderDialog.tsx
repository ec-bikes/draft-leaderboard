import React from 'react';
import type { RaceResult, Rider } from '../../common/types/Rider.js';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import type { Group } from '../../common/types/Group.js';
import { CloseIcon } from '../icons/Close.js';
import type { TeamDetailsJson } from '../../common/types/TeamJson.js';
import { years } from '../../common/constants.js';

export interface RiderDialogProps {
  group: Group;
  teamOwner: string;
  rider: Rider & { uciUrl: string; pcsUrl: string };
  year: number;
  onClose: () => void;
}

const ResultRow = styled(TableRow)({
  // Force dates (1) not to wrap
  [`& td:nth-of-type(1)`]: { whiteSpace: 'nowrap' },
});

function CloseButton(props: { onClose: () => void }) {
  return (
    <IconButton
      aria-label="close"
      onClick={props.onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  );
}

// this has to be export default due to react.lazy
export default function RiderDialog(props: RiderDialogProps) {
  const { teamOwner, rider, group, year, onClose } = props;
  const [results, setResults] = React.useState<RaceResult[]>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    const teamName = teamOwner.split(' ')[0].toLowerCase();
    const teamPromise =
      year === years[0]
        ? import(`../../data/${group}/details/${teamName}.json`)
        : import(`../../data/${group}${year}/details/${teamName}.json`);
    teamPromise
      .then(({ team }: TeamDetailsJson) => {
        const results = team.riders.find((r) => r.name === rider.name)?.results;
        if (results) {
          setResults(results);
        } else {
          setError('Rider not found in team');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load team details: ' + err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only for initial render
  }, []);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        <strong>{rider.name}</strong>
      </DialogTitle>
      <CloseButton onClose={onClose} />
      <DialogContent>
        <Typography>
          {rider.totalPoints} points
          {rider.sanctions ? ` (including -${rider.sanctions} sanctions)` : ''} -{' '}
          <Link target="_blank" href={rider.uciUrl}>
            UCI
          </Link>
          {' - '}
          <Link target="_blank" href={rider.pcsUrl}>
            PCS
          </Link>
          <br />
          <br />
        </Typography>
        {results && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, i) => (
                <ResultRow key={i}>
                  <TableCell>{result.date}</TableCell>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.rank}</TableCell>
                  <TableCell>
                    {result.points % 1 !== 0 ? result.points.toFixed(2) : result.points}
                  </TableCell>
                </ResultRow>
              ))}
            </TableBody>
          </Table>
        )}
        {error}
      </DialogContent>
    </Dialog>
  );
}
