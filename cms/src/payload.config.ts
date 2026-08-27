import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Cases } from './collections/Cases'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Leads } from './collections/Leads'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Origins allowed for CORS/CSRF: the website + the CMS admin panel itself.
const allowedOrigins = [
  'https://derenko.online',
  'https://law.vasya-derenko.workers.dev',
  'http://localhost:4321',
  'http://localhost:3000',
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
