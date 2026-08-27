import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Cases } from './collections/Cases'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Origins allowed for CORS/CSRF: the website(s) + the CMS admin panel itself.
// ALLOWED_ORIGINS: comma-separated, e.g. "https://law.xxx.workers.dev,https://example.com"
const allowedOrigins = [
  'http://localhost:4321',
  'http://localhost:3000',
  ...(process.env.ALLOWED_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? []),
  ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Articles, Cases, Services, Testimonials, Leads, Media, Users],
  globals: [SiteSettings],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
