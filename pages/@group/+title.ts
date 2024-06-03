import type { PageContext } from 'vike/types';

export function title(pageContext: PageContext) {
  const group = pageContext.routeParams!.group!;
  return 'Escape Collective draft rankings - ' + group[0].toUpperCase() + group.slice(1);
}
