// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import tunnel from 'astro-tunnel';
import path from 'path';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  },
  site: "https://timeloop.com.uy",
  integrations: [react(), tunnel(), sitemap()],
  adapter: vercel(),
  base: '/admin',
});