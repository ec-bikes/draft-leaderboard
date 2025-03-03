import type React from 'react';
import { Stack, styled, Typography } from '@mui/material';
import type { Team } from '../../common/types/Team';
import { rankingNumberSize, spacing } from '../theme.js';
import { ArrowUpIcon } from '../icons/ArrowUp.js';

const arrowSize = 0.9;
const arrowStyle: React.CSSProperties = {
  fontSize: `${arrowSize}rem`,
  marginRight: '7px',
  marginBottom: `${((rankingNumberSize - arrowSize) / 4).toFixed(2)}rem`,
};
const ArrowUp = styled(ArrowUpIcon)({
  color: '#4caf50',
  ...arrowStyle,
});
const ArrowDown = styled(ArrowUpIcon)({
  color: 'red',
  transform: 'rotate(180deg)',
  ...arrowStyle,
});

export function TeamCardHeader(props: { team: Team; rank: number }) {
  const { team, rank } = props;
  const { movement } = team;

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
          {movement ? movement > 0 ? <ArrowUp /> : <ArrowDown /> : null}
          {/* {movement ? (
              <span
                style={{
                  position: 'absolute',
                  fontSize: '1.2rem',
                  top: '0.7rem',
                  left: rank === 1 ? 0 : -8,
                  // left: rank === 1 ? -2 : -9,
                  color: movement > 0 ? '#4caf50' : 'red',
                }}
              >
                {movement > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </span>
            ) : null} */}
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
