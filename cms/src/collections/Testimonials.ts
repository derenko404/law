import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Відгук',
    plural: 'Відгуки',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'text'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'text', label: 'Текст відгуку', type: 'textarea', required: true, maxLength: 600 },
    { name: 'author', label: 'Автор', type: 'text', required: true },
    {
      name: 'order',
      label: 'Порядок',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Менше число — вище у списку' },
    },
  ],
  defaultSort: 'order',
}
