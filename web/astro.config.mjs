// @ts-check
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Canonical origin for SEO (canonical/og/sitemap URLs).
  // Override per-deployment with the SITE_URL build variable.
  site: process.env.SITE_URL ?? "https://advokat-uzhgorod.com.ua",
  adapter: cloudflare(),

  build: {
    inlineStylesheets: "always",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
