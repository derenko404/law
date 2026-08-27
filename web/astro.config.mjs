// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  // Current production domain; swap when the lawyer's own domain moves over
  site: 'https://derenko.online',
  adapter: cloudflare(),

  build: {
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },

});