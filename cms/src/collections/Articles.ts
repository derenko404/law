import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Стаття',
    plural: 'Статті',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'title', label: 'Заголовок', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Латиницею, через дефіс: rozluchennya-z-chogo-pochaty' },
    },
    {
      name: 'description',
      label: 'Короткий опис',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    { name: 'category', label: 'Категорія', type: 'text' },
    {
      name: 'publishedAt',
      label: 'Дата публікації',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'content', label: 'Текст статті', type: 'richText', required: true },
  ],
}
