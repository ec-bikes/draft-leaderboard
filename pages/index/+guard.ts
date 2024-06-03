import { redirect } from 'vike/abort';
import type { PageContext } from 'vike/types';
import { baseUrl } from '../../common/constants.js';

// Redirect the root /draft-leaderboard/ route.
// NOTE: for some reason this doesn't work on github pages...
export function guard(pageContext: PageContext) {
  if (!pageContext.routeParams?.group) {
    throw redirect(baseUrl + 'women');
  }
}
