import React from 'react';
import { navigate } from 'vike/client/router';
import { getPageUrl } from '../../common/pageUrls.js';

// Forces vike to generate an index page for github pages...
// Also work around the fact that the usual guard method (https://vike.dev/guard)
// doesn't appear to work on github pages.
export function Page() {
  React.useEffect(() => {
    navigate(getPageUrl('women'));
  }, []);
  return null;
}
