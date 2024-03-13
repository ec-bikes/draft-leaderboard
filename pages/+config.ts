import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

// https://vike.dev/config
// https://www.npmjs.com/package/vike-react
const config: Config = {
  extends: vikeReact,
  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,
};

export default config;
