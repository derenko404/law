# Law Website — АБ «Марина В.Г. Юридичний захист»

Website for a lawyer in Uzhhorod. Three-part plan:

1. **`web/` — Astro landing** (done) — modern landing modeled on competitor UI/UX
   (ignatkoadvokat.com, advokatperesolyak.com.ua), content and logo from the
   current site (advokat-uzhgorod.com.ua). Hosted on **Cloudflare Workers**
   via `@astrojs/cloudflare` (static prerender + server API routes).
2. **`cms/` — Payload CMS** (planned) — articles (blog page in Astro), services
   and prices, editable site data (socials, contacts), consultation leads.
3. **`bot/` — Telegram bot** (planned) — receives consultation requests from
   the website form; lawyer manages them in Payload.

## web/

- Astro 7 + Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript.
- Deploy target: Cloudflare Workers (`wrangler.jsonc`, assets binding).
  Build: `npm run build`, deploy: `npx wrangler deploy`.
- Brand: gold `--color-gold-500: #cc8800` (extracted from the logo) — all brand
  colors are CSS variables in `src/styles/global.css` `@theme`, swap in one place.
- Logo emblem vectorized to SVG (`src/components/Emblem.astro`, potrace from
  the original PNG in `research/logo.png`), colored via `currentColor`.
- Fonts: Forum (display, Cyrillic) + Manrope (body), Google Fonts.
- Editable data lives in `src/data/*.ts` — shaped to be replaced by Payload
  fetches in part 2 (services + placeholder prices, contacts, socials, stats,
  testimonials).
- Form endpoint: `src/pages/api/consultation.ts` (server-rendered on Workers).
  Integration TODOs for Payload (persist lead) and Telegram (notify) are marked
  inside.

## research/

Original assets pulled from the current site (logo PNG, traced SVG).
