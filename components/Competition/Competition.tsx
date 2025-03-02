import { Link, Stack, Typography } from '@mui/material';
import { TeamCards } from '../../components/TeamCards/TeamCards';
import type { Group } from '../../common/types/Group';
import { getUciSeasonRankingUrl } from '../../common/uciUrls.js';
import { spacing } from '../theme.js';
import type { TeamsSummaryJson } from '../../common/types/TeamJson.js';
import type { Draft } from '../../common/types/Draft.js';
import { formatDate } from '../../scripts/data/formatDate.js';
import { years } from '../../common/constants.js';
import { getPageUrl } from '../../common/pageUrls.js';

export interface CompetitionProps extends Draft {
  group: Group;
  teamData: TeamsSummaryJson;
}

export function Competition(props: CompetitionProps) {
  const { group, podcast, link, teamData, tradeDate, year } = props;
  const { source } = teamData;

  const linkText = (
    <>
      <em>{podcast}</em> podcast draft team
    </>
  );

  return (
    <Stack gap={spacing.general} alignItems="center">
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
        as of <strong>{source === 'uci' ? teamData.rankingDate : teamData.fetchedDate}</strong>.
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
