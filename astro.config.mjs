// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

const enableKeystatic = process.env.NODE_ENV !== 'production';

// https://astro.build/config
export default defineConfig({
  site: 'https://me-port-3013b.web.app',
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), markdoc(), ...(enableKeystatic ? [keystatic()] : [])],
});