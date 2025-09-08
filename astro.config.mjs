// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import tunnel from 'astro-tunnel';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), tunnel()],
});