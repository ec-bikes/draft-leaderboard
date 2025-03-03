import type React from 'react';
import { Stack, styled, Typography } from '@mui/material';
import type { Team } from '../../common/types/Team';
import { rankingNumberSize, spacing } from '../theme.js';
import { ArrowUpIcon } from '../icons/ArrowUp.js';
import { CircleSmallIcon } from '../icons/CircleSmall.js';

const arrowSize = 0.9;
const iconStyle: React.CSSProperties = {
  fontSize: `${arrowSize}rem`,
  marginRight: '8px',
  marginBottom: `${((rankingNumberSize - arrowSize) / 4).toFixed(2)}rem`,
};
const ArrowUp = styled(ArrowUpIcon)({
  ...iconStyle,
  color: '#4caf50',
});
const ArrowDown = styled(ArrowUpIcon)({
  ...iconStyle,
  color: 'red',
  transform: 'rotate(180deg)',
});
const CircleSmall = styled(CircleSmallIcon)({
  ...iconStyle,
  color: '#aaa',
  marginRight: '6px',
});

export function TeamCardHeader(props: { team: Team; rank: number }) {
  const { team, rank } = props;
  const { movement = 0 } = team;

  return (
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
          {movement > 0 ? <ArrowUp /> : movement < 0 ? <ArrowDown /> : <CircleSmall />}
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
  );
}
