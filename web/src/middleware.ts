import { defineMiddleware } from 'astro:middleware';

/**
 * Edge caching for SSR HTML on Cloudflare Workers.
 * Pages render from CMS data; caching them at the edge for a few minutes
 * keeps performance at prerendered levels. Content edits show up within
 * CACHE_TTL seconds.
 */
const CACHE_TTL = 300;

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;

  if (request.method !== 'GET' || context.url.pathname.startsWith('/api/')) {
    return next();
  }

  // caches.default exists only in the Workers runtime (not in astro dev)
  const cache = (globalThis as unknown as { caches?: { default: Cache } }).caches?.default;
  if (!cache) return next();

  const cacheKey = new Request(context.url.toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const response = await next();
  if (response.status !== 200) return response;

  const toCache = response.clone();
  const headers = new Headers(toCache.headers);
  headers.set('Cache-Control', `public, s-maxage=${CACHE_TTL}`);
  const cacheable = new Response(toCache.body, {
    status: toCache.status,
    statusText: toCache.statusText,
    headers,
  });

  context.locals.cfContext?.waitUntil?.(cache.put(cacheKey, cacheable.clone()));
  return cacheable;
});
