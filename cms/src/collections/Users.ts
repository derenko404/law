import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // API keys let the website create leads server-to-server
    useAPIKey: true,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
