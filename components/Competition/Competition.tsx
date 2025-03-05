import { Link, Stack, Typography } from '@mui/material';
import { useData } from 'vike-react/useData';
import { years } from '../../common/constants.js';
import { formatDate } from '../../common/formatDate.js';
import { getPageUrl } from '../../common/pageUrls.js';
import type { DraftData, Group } from '../../common/types/index';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';
import { TeamCards } from '../TeamCards/TeamCards';
import { spacing } from '../theme.js';

export function Competition() {
  const data = useData<DraftData>();
  const { source, group, year, podcast, link, tradeDate } = data;

  const linkText = (
    <>
      <em>{podcast}</em> podcast draft team
    </>
  );

  return (
    <Stack gap={spacing.competitionVertical} alignItems="center">
      <Typography variant="description">
        {`${year} `}
        {link ? (
          <Link target="_blank" href={link}>
            {linkText}
          </Link>
        ) : (
          linkText
        )}{' '}
        rankings, based on{' '}
        {source === 'uci' ? (
          <Link target="_blank" href={getUciSeasonRankingUrl({ momentId: data.momentId, group })}>
            UCI points
          </Link>
        ) : (
          <>UCI points (via PCS)</>
        )}{' '}
        as of <strong>{source === 'uci' ? data.uciRankingDate : data.fetchedDate}</strong>.
        {tradeDate && (
          <>
            <br />
            Includes trades from {formatDate(new Date(tradeDate), 'short')}.
          </>
        )}
        <br />
        (Other years: {getYearLinks(group, year)})
      </Typography>

      <TeamCards />
    </Stack>
  );
}

function getYearLinks(group: Group, currentYear: number) {
  const otherYears = years.filter((year) => year !== currentYear);
  return otherYears.map((year) => (
    <Link key={year} href={getPageUrl(group, year)}>
      {year}
    </Link>
  ));
}
