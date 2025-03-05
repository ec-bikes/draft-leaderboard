import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

// https://vike.dev/config
// https://vike.dev/vike-react
const config: Config = {
  extends: [vikeReact],
  prerender: {
    // for route /foo, generate /foo.html rather than /foo/index.html
    noExtraDir: true,
  },
  disableUrlNormalization: true,
};

export default config;
