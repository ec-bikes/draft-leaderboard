import { ButtonBase, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import type { Team } from '../../common/types/index';
import { ArrowUpIcon } from '../icons/ArrowUp.js';
import { CircleSmallIcon } from '../icons/CircleSmall.js';
import { rankingNumberSize, spacing } from '../theme.js';

const LazyHistoryDialog = React.lazy(() => import('../HistoryDialog/HistoryDialog.js'));

const arrowSize = 0.9;
const iconStyle: React.CSSProperties = {
  fontSize: `${arrowSize}rem`,
  marginRight: '8px',
  marginBottom: `${((rankingNumberSize - arrowSize) / 4).toFixed(2)}rem`,
};
const ArrowUp = styled(ArrowUpIcon)(({ theme }) => ({
  ...iconStyle,
  color: theme.vars.palette.success.light,
}));
const ArrowDown = styled(ArrowUpIcon)(({ theme }) => ({
  ...iconStyle,
  color: theme.vars.palette.error.main,
  transform: 'rotate(180deg)',
}));
const CircleSmall = styled(CircleSmallIcon)(({ theme }) => ({
  ...iconStyle,
  color: theme.vars.palette.grey[400],
  marginRight: '6px',
}));

const RankingButton = styled(ButtonBase)({
  fontFamily: 'inherit',
  lineHeight: '1.0',
  cursor: 'pointer',
  alignItems: 'flex-end',
  whiteSpace: 'nowrap',
});

export function TeamCardHeader(props: { team: Team; rank: number }) {
  const { team, rank } = props;
  const { movement = 0 } = team;
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={spacing.teamCard.headerHorizontal}
    >
      <Stack
        component={RankingButton}
        onClick={() => setShowHistory(true)}
        title="View rankings history"
        spacing={spacing.teamCard.rankingVertical}
        // Extra padding (1 spacing unit) to match the table content
        // (the row divider lines extend beyond the content)
        paddingLeft={1}
      >
        <span>
          {movement > 0 ? (
            <ArrowUp titleAccess={`+${movement} since last week`} />
          ) : movement < 0 ? (
            <ArrowDown titleAccess={`${movement} since last week`} />
          ) : (
            <CircleSmall titleAccess="no change since last week" />
          )}
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
      {showHistory && <LazyHistoryDialog onClose={() => setShowHistory(false)} />}
    </Stack>
  );
}
