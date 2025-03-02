import type { PageContext } from 'vike/types';
import { years } from '../../common/constants.js';

export function title(pageContext: PageContext) {
  // group is always set, year might not be
  const { group = '', year = years[0] } = pageContext.routeParams!;

  return `Escape Collective ${year} draft rankings - ${group[0].toUpperCase()}${group.slice(1)}`;
}
