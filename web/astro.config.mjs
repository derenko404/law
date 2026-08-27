// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  // Canonical origin for SEO (canonical/og/sitemap URLs).
  // Override per-deployment with the SITE_URL build variable.
  site: process.env.SITE_URL ?? 'https://advokat-uzhgorod.misha299235.workers.dev',
  adapter: cloudflare(),

  build: {
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },

});