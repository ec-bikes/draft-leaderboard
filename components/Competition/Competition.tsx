import { Link, Stack, Typography } from '@mui/material';
import { TeamCards } from '../TeamCards/TeamCards';
import type { Group } from '../../common/types/Group';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';
import { spacing } from '../theme.js';
import { formatDate } from '../../common/formatDate.js';
import { years } from '../../common/constants.js';
import { getPageUrl } from '../../common/pageUrls.js';
import type { ClientData } from '../../common/types/ClientData.js';

export function Competition(props: ClientData) {
  const { teamData, draft } = props;
  const { group, year, podcast, link, tradeDate } = draft;
  const { source } = teamData;

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
          <Link
            target="_blank"
            href={getUciSeasonRankingUrl({ momentId: teamData.momentId, group })}
          >
            UCI points
          </Link>
        ) : (
          <>UCI points (via PCS)</>
        )}{' '}
        as of <strong>{source === 'uci' ? teamData.uciRankingDate : teamData.fetchedDate}</strong>.
        {tradeDate && (
          <>
            <br /> Includes trades from {formatDate(new Date(tradeDate), 'short')}.
          </>
        )}
        <br />
        (Other years: {getYearLinks(group, year)})
      </Typography>

      <TeamCards teamData={teamData} group={group} year={year} />
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
