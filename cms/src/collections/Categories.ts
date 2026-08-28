import type { CollectionConfig } from 'payload'

import { slugFrom } from '../lib/slug'

/**
 * Practice-area categories shared by articles and won cases.
 * Managed by the lawyer in the admin panel: add, rename, delete freely —
 * documents reference a category by id, so renames propagate everywhere.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категорія',
    plural: 'Категорії',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', label: 'Назва', type: 'text', required: true, unique: true },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [slugFrom('title')] },
      admin: {
        position: 'sidebar',
        description: 'Залиште порожнім — згенерується з назви (mytni-spravy). Використовується у посиланнях фільтра.',
      },
    },
    {
      name: 'order',
      label: 'Порядок',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
  defaultSort: 'order',
}
