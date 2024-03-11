import type { Config } from 'vike/types';

// https://vike.dev/config
const config: Config = {
  // https://vike.dev/clientRouting
  clientRouting: true,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true },
    },
    // Define new setting 'description'
    description: {
      env: { server: true },
    },
  },
  hydrationCanBeAborted: true,
};

export default config;
