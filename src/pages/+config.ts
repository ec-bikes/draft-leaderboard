import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';
import { Layout } from '../components/Layout/Layout.js';

// https://vike.dev/config
const config: Config = {
  // https://vike.dev/clientRouting
  clientRouting: true,
  extends: vikeReact,
  hydrationCanBeAborted: true,
  // from vike-react
  // https://www.npmjs.com/package/vike-react
  // title: '',
  Layout,
};

export default config;
