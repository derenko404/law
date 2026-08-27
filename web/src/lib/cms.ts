/**
 * Payload CMS client for the website (runs on Cloudflare Workers SSR).
 *
 * Env (wrangler secrets / .dev.vars locally):
 *   CMS_URL      — Payload origin, e.g. https://cms.derenko.online
 *   CMS_API_KEY  — user API key, used only for creating leads
 *
 * Every reader falls back to the local seed data in src/data/* when the CMS
 * is unreachable, so the landing never renders empty because of an outage.
 */
// @ts-expect-error virtual module provided by the Cloudflare runtime (and shimmed in astro dev)
import { env as workerEnv } from 'cloudflare:workers';

import { site as fallbackSite, socials as fallbackSocials, stats as fallbackStats } from '../data/site';
import { services as fallbackServices, extraAreas as fallbackExtraAreas } from '../data/services';
import { testimonials as fallbackTestimonials } from '../data/content';

export interface CmsEnv {
  CMS_URL?: string;
  CMS_API_KEY?: string;
}

export function cmsEnv(): CmsEnv {
  const env = (workerEnv ?? {}) as Record<string, string | undefined>;
  return {
    CMS_URL: env.CMS_URL ?? import.meta.env.CMS_URL,
    CMS_API_KEY: env.CMS_API_KEY ?? import.meta.env.CMS_API_KEY,
  };
}

async function cmsGet<T>(env: CmsEnv, path: string): Promise<T | null> {
  if (!env.CMS_URL) return null;
  try {
    const res = await fetch(`${env.CMS_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error('CMS fetch failed:', path, err);
    return null;
  }
}

// ---------- Site settings ----------

export interface SiteSettings {
  name: string;
  shortName: string;
  lawyer: string;
  city: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  hours: string;
  mapUrl: string;
  description: string;
  socials: { icon: string; href: string }[];
  stats: { value: number; suffix: string; label: string }[];
  extraAreas: string[];
}

const staticSite = {
  name: fallbackSite.name,
  shortName: fallbackSite.shortName,
  lawyer: fallbackSite.lawyer,
  city: fallbackSite.city,
  description: fallbackSite.description,
};

export async function getSettings(env: CmsEnv): Promise<SiteSettings> {
  const doc = await cmsGet<Record<string, unknown>>(env, '/api/globals/site-settings');
  if (!doc) {
    return {
      ...staticSite,
      phone: fallbackSite.phone,
      phoneHref: fallbackSite.phoneHref,
      email: fallbackSite.email,
      address: fallbackSite.address,
      hours: fallbackSite.hours,
      mapUrl: fallbackSite.mapUrl,
      socials: fallbackSocials.map((s) => ({ icon: s.icon, href: s.href })),
      stats: fallbackStats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),
      extraAreas: [...fallbackExtraAreas],
    };
  }
  return {
    ...staticSite,
    phone: String(doc.phone),
    phoneHref: String(doc.phoneHref),
    email: String(doc.email),
    address: String(doc.address),
    hours: String(doc.hours),
    mapUrl: String(doc.mapUrl),
    socials: ((doc.socials as { icon: string; href: string }[]) ?? []).map((s) => ({
      icon: s.icon,
      href: s.href,
    })),
    stats: ((doc.stats as { value: number; suffix?: string; label: string }[]) ?? []).map((s) => ({
      value: s.value,
      suffix: s.suffix ?? '+',
      label: s.label,
    })),
    extraAreas: ((doc.extraAreas as { title: string }[]) ?? []).map((a) => a.title),
  };
}

// ---------- Services ----------

export interface CmsService {
  id: string;
  title: string;
  icon: string;
  points: string[];
  priceFrom: number | null;
}

export async function getServices(env: CmsEnv): Promise<CmsService[]> {
  const res = await cmsGet<{ docs: Record<string, unknown>[] }>(
    env,
    '/api/services?limit=50&sort=order',
  );
  if (!res?.docs?.length) {
    return fallbackServices.map((s) => ({ ...s, points: [...s.points] }));
  }
  return res.docs.map((d) => ({
    id: String(d.serviceId),
    title: String(d.title),
    icon: String(d.icon),
    points: ((d.points as { text: string }[]) ?? []).map((p) => p.text),
    priceFrom: (d.priceFrom as number | null) ?? null,
  }));
}

// ---------- Testimonials ----------

export interface CmsTestimonial {
  text: string;
  author: string;
}

export async function getTestimonials(env: CmsEnv): Promise<CmsTestimonial[]> {
  const res = await cmsGet<{ docs: CmsTestimonial[] }>(
    env,
    '/api/testimonials?limit=6&sort=order',
  );
  if (!res?.docs?.length) return [...fallbackTestimonials];
  return res.docs.map((d) => ({ text: d.text, author: d.author }));
}

// ---------- Articles & cases ----------

export interface CmsEntryBase {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
}

export interface CmsArticle extends CmsEntryBase {
  category?: string;
  content?: unknown;
}

export interface CmsCase extends CmsEntryBase {
  category: string;
  result: string;
  content?: unknown;
}

export interface Paged<T> {
  docs: T[];
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

const LIST_FIELDS = 'select[title]=true&select[slug]=true&select[description]=true&select[category]=true&select[result]=true&select[publishedAt]=true';

export async function getArticles(env: CmsEnv, page = 1, limit = 9): Promise<Paged<CmsArticle> | null> {
  return cmsGet(env, `/api/articles?limit=${limit}&page=${page}&sort=-publishedAt&${LIST_FIELDS}`);
}

export async function getArticle(env: CmsEnv, slug: string): Promise<CmsArticle | null> {
  const res = await cmsGet<{ docs: CmsArticle[] }>(
    env,
    `/api/articles?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );
  return res?.docs?.[0] ?? null;
}

export async function getCases(env: CmsEnv, page = 1, limit = 9): Promise<Paged<CmsCase> | null> {
  return cmsGet(env, `/api/cases?limit=${limit}&page=${page}&sort=-publishedAt&${LIST_FIELDS}`);
}

export async function getCase(env: CmsEnv, slug: string): Promise<CmsCase | null> {
  const res = await cmsGet<{ docs: CmsCase[] }>(
    env,
    `/api/cases?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );
  return res?.docs?.[0] ?? null;
}

// ---------- Leads ----------

export async function createLead(
  env: CmsEnv,
  lead: { name: string; phone: string; service?: string; message?: string },
): Promise<boolean> {
  if (!env.CMS_URL || !env.CMS_API_KEY) {
    console.error('createLead: CMS_URL / CMS_API_KEY not configured');
    return false;
  }
  try {
    const res = await fetch(`${env.CMS_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `users API-Key ${env.CMS_API_KEY}`,
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error('createLead failed:', res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error('createLead error:', err);
    return false;
  }
}
