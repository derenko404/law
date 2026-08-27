import type { APIRoute } from 'astro';

import { cmsEnv, getArticles, getCases } from '../lib/cms';

export const prerender = false;

/** Sitemap built from live CMS content (SSR pages are invisible to the static sitemap integration). */
export const GET: APIRoute = async ({ site }) => {
  const env = cmsEnv();
  const origin = site?.href.replace(/\/$/, '') ?? 'https://derenko.online';

  const urls: string[] = ['/', '/articles', '/cases'];

  const [articles, cases] = await Promise.all([
    getArticles(env, 1, 500),
    getCases(env, 1, 500),
  ]);
  for (const a of articles?.docs ?? []) urls.push(`/articles/${a.slug}`);
  for (const c of cases?.docs ?? []) urls.push(`/cases/${c.slug}`);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${origin}${u}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
