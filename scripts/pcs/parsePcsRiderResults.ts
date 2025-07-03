import type { HTMLElement as BasicHTMLElement } from 'node-html-parser';
import { formatDate, parseDate } from '../../common/dates.js';
import type { RaceResult } from '../../common/types/index.js';

const expectedHeaders = [
  // 0. day.month (21.04) or date range (08.02 » 11.02) for stage race header
  'Date',
  // 1. ranking
  '#Result',
  // 2. GC ranking?
  '',
  // 3. jersey icon
  '',
  // 4. race name OR stage name
  'Race',
  'Distance',
  'Points\nPCS',
  // 7. UCI points and +bonuses (empty for stage race header)
  'Points\nUCI',
  // 8. rider in race link
  '',
];

/**
 * Parse the results table. Throws an error on unexpected data format.
 */
export function parsePcsRiderResults(params: {
  resultsTable: BasicHTMLElement;
  pcsUrl: string;
  year: number;
}): RaceResult[] {
  const { resultsTable, pcsUrl, year } = params;

  // verify the page format hasn't changed
  // (for a rider who hasn't raced, the table is still there but no body rows)
  const headers = resultsTable.querySelectorAll('thead th').map((th) => th.textContent.trim());
  if (
    headers.length !== expectedHeaders.length ||
    !headers.every((header, i) => header === expectedHeaders[i])
  ) {
    const headerList = headers.map((h) => `"${h.replace(/\n/g, '\\n')}"`).join(', ');
    throw new Error(`Unexpected table headers at ${pcsUrl}: ${headerList}`);
  }

  // parse the results
  const results: RaceResult[] = [];
  const resultRows = resultsTable.querySelectorAll('tbody tr');
  let pendingStageRace: { name: string; date: string } | undefined;

  for (const row of resultRows) {
    // "main" class is for one-day races or stage race headers ("stage" is for stages or jerseys)
    const isMainResult = row.classList.contains('main');
    // Clear any previous pending stage race.
    if (isMainResult) pendingStageRace = undefined;

    const cells = row.querySelectorAll('td');

    const rank = Number(cells[1].textContent.trim()) || undefined;

    // Date: day.month (21.04), date range (08.02 › 11.02) for stage race header
    // (under a .hideIfMobile span, with a different .showIfMobile variant),
    // or empty for GC or jersey results
    const dateCell = cells[0].querySelector('.hideIfMobile') || cells[0];
    const rawDateStr = dateCell.textContent.trim();
    const isStageRaceHeader = isMainResult && rawDateStr.includes('›');
    // Take the end date for stage races.
    const dateMatch = rawDateStr.match(/(\d\d)\.(\d\d)$/);
    // Parse the date.
    // If it's not set, this is a GC or jersey result from a stage race, so take that date.
    const dateObj = dateMatch ? parseDate(`${year}-${dateMatch[2]}-${dateMatch[1]}`) : undefined;
    let date: string;
    if (dateObj) {
      date = formatDate(dateObj, 'shortDate');
    } else if (pendingStageRace) {
      // format to match date strings from UCI
      date = pendingStageRace.date;
    } else {
      console.log(resultsTable.outerHTML);
      throw new Error(`No corresponding stage race header for row: ${row.outerHTML}`);
    }

    // Race name:
    //   <td class="name"><span class="flag be"></span><a href="race/liege-bastogne-liege-femmes/2024/result">
    //   Liège-Bastogne-Liège Femmes <span>(1.WWT)</span></a></td>
    // and sometimes there's an extra bit after the link, so just take the link text
    // (remove the class code)
    let name = cells[4]
      .querySelector('a')!
      .textContent.trim()
      .replace(/ \([^)]*\)$/, '');

    if (isStageRaceHeader) {
      // Track a new stage race
      pendingStageRace = { name, date };
    } else if (pendingStageRace) {
      // Delete the locations for stages (the parens are sometimes ITT/TTT)
      name = name.replace(/^(Stage \d+( \(\w+\))?|Prologue).*/, '$1');
      // Prepend the stage race name to the sub-result
      name = `${pendingStageRace.name} - ${name}`;
    }

    // UCI points and +bonuses (empty for stage race header usually)
    //   <td class="cu600 ">8<span style="font-size: 10px; letter-spacing: -0.5px; color:#9532a8; ">&nbsp;+6</span></td>
    // The +bonus might appear without points if the rider was leading the GC but didn't score stage points.
    // TODO where are WWT leader's jersey points listed for stage race start?
    // (any chance there can be multiple + for a single points cell?)
    const pointsText = cells[7].textContent.trim();
    const pointsMatch = pointsText.match(/^([\d.]+)?(?:\s*\+\s*(\d+))?/);

    if (pointsMatch?.[1]) {
      // Main result
      results.push({ name, date, points: Number(pointsMatch[1]), rank });
    }
    if (pointsMatch?.[2]) {
      // No easy way to tell if this is the GC bonus, WWT leader's jersey, or something else
      // (maybe unless we try to parse the color of the span...)
      results.push({ name: `${name} - Bonus`, date, points: Number(pointsMatch[2]) });
    }
  }

  return results;
}
