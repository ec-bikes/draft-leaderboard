import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import { baseUrl } from './common/constants.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vike({
      prerender: true,
      disableUrlNormalization: true,
    }),
  ],
  // this needs to match the path on github pages, https://ec-bikes.github.io/draft-leaderboard/
  base: baseUrl,
});
