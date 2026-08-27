/**
 * One-time seed: migrates the website's file-based content into Payload.
 * Run: npx payload run scripts/seed.ts
 * Idempotent-ish: skips collections that already have documents.
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

import config from '../src/payload.config'

const WEB_CONTENT = path.resolve(process.cwd(), 'seed-content')

interface ParsedMd {
  data: Record<string, string>
  body: string
}

function parseMd(file: string): ParsedMd {
  const raw = readFileSync(file, 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) throw new Error(`No frontmatter in ${file}`)
  const data: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) data[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '')
  }
  return { data, body: m[2].trim() }
}

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: await config })

const md = (body: string) => convertMarkdownToLexical({ editorConfig, markdown: body })

// ---- Admin user ----
const users = await payload.find({ collection: 'users', limit: 1 })
if (users.totalDocs === 0) {
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@derenko.online',
      password: 'change-me-on-railway',
      enableAPIKey: true,
    },
  })
  console.log('created admin user admin@derenko.online / change-me-on-railway (CHANGE IT)')
}

// ---- Articles ----
if ((await payload.find({ collection: 'articles', limit: 1 })).totalDocs === 0) {
  for (const f of readdirSync(`${WEB_CONTENT}/articles`)) {
    const { data, body } = parseMd(`${WEB_CONTENT}/articles/${f}`)
    await payload.create({
      collection: 'articles',
      data: {
        title: data.title,
        slug: f.replace(/\.md$/, ''),
        description: data.description,
        category: data.category,
        publishedAt: new Date(data.pubDate).toISOString(),
        content: md(body),
        _status: 'published',
      },
    })
    console.log('article:', f)
  }
}

// ---- Cases ----
if ((await payload.find({ collection: 'cases', limit: 1 })).totalDocs === 0) {
  for (const f of readdirSync(`${WEB_CONTENT}/cases`)) {
    const { data, body } = parseMd(`${WEB_CONTENT}/cases/${f}`)
    await payload.create({
      collection: 'cases',
      data: {
        title: data.title,
        slug: f.replace(/\.md$/, ''),
        description: data.description,
        category: data.category,
        result: data.result,
        publishedAt: new Date(data.pubDate).toISOString(),
        content: md(body),
        _status: 'published',
      },
    })
    console.log('case:', f)
  }
}

// ---- Services ----
if ((await payload.find({ collection: 'services', limit: 1 })).totalDocs === 0) {
  const { services } = await import('../../web/src/data/services')
  let order = 0
  for (const s of services) {
    await payload.create({
      collection: 'services',
      data: {
        title: s.title,
        serviceId: s.id,
        icon: s.icon,
        points: s.points.map((text: string) => ({ text })),
        priceFrom: s.priceFrom ?? undefined,
        order: order++,
      },
    })
    console.log('service:', s.id)
  }
}

// ---- Testimonials ----
if ((await payload.find({ collection: 'testimonials', limit: 1 })).totalDocs === 0) {
  const { testimonials } = await import('../../web/src/data/content')
  let order = 0
  for (const t of testimonials) {
    await payload.create({
      collection: 'testimonials',
      data: { text: t.text, author: t.author, order: order++ },
    })
  }
  console.log('testimonials:', testimonials.length)
}

// ---- Site settings ----
{
  const { site, socials, stats } = await import('../../web/src/data/site')
  const { extraAreas } = await import('../../web/src/data/services')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      phone: site.phone,
      phoneHref: site.phoneHref,
      email: site.email,
      address: site.address,
      hours: site.hours,
      mapUrl: site.mapUrl,
      socials: socials.map((s) => ({ icon: s.icon, href: s.href })),
      stats: stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),
      extraAreas: extraAreas.map((title: string) => ({ title })),
    },
  })
  console.log('site-settings updated')
}

console.log('seed done')
process.exit(0)
