// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Keystatic は開発時のみ有効（preview / build では SSR ルートが含まれない）
const enableKeystatic = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://capcom-d876d.web.app',
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), markdoc(), ...(enableKeystatic ? [keystatic()] : [])],
});