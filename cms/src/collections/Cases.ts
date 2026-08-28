import type { CollectionConfig } from 'payload'

import { slugFrom } from '../lib/slug'

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: {
    singular: 'Виграна справа',
    plural: 'Виграні справи',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'result', 'publishedAt', '_status'],
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
    { name: 'title', label: 'Назва справи', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [slugFrom('title')] },
      admin: { position: 'sidebar', description: 'Залиште порожнім — згенерується з назви' },
    },
    {
      name: 'description',
      label: 'Короткий опис',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'category',
      label: 'Категорія',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    { name: 'result', label: 'Результат', type: 'text', required: true },
    {
      name: 'publishedAt',
      label: 'Дата',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'content', label: 'Опис справи', type: 'richText', required: true },
  ],
}
