import { useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { baseUrl } from '../../common/constants.js';

// Forces vike to generate an index page for github pages...
// Also work around the fact the +guard redirect doesn't work on github pages??
export function Page() {
  useEffect(() => {
    navigate(baseUrl + 'women');
  }, []);
  return null;
}
