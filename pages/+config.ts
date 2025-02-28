import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

// https://vike.dev/config
// https://vike.dev/vike-react
const config: Config = {
  extends: [vikeReact],
  prerender: true,
  disableUrlNormalization: true,
};

export default config;
