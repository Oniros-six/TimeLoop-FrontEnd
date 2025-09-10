// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from "@tailwindcss/vite";
import tunnel from 'astro-tunnel';
import path from 'path';

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
  integrations: [react(), netlify(), tunnel()],
});