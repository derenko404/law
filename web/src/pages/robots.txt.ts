import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const origin = site?.href.replace(/\/$/, '') ?? '';
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
