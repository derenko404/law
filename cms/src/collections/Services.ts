import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Послуга',
    plural: 'Послуги',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceFrom', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', label: 'Назва', type: 'text', required: true },
    {
      name: 'serviceId',
      label: 'Ідентифікатор',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Латиницею, використовується у формі: criminal, family…',
      },
    },
    {
      name: 'icon',
      label: 'Іконка',
      type: 'select',
      required: true,
      defaultValue: 'scale',
      options: [
        { label: 'Щит (кримінальне)', value: 'shield' },
        { label: 'Молоток (адміністративне)', value: 'gavel' },
        { label: 'Терези (цивільне)', value: 'scale' },
        { label: 'Родина (сімейне)', value: 'family' },
        { label: 'Кордон (митне)', value: 'customs' },
        { label: 'Ділянка (земельне)', value: 'land' },
        { label: 'Портфель (бізнес)', value: 'briefcase' },
        { label: 'Документ (трудове)', value: 'contract' },
      ],
    },
    {
      name: 'points',
      label: 'Пункти',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      fields: [{ name: 'text', label: 'Текст', type: 'text', required: true }],
    },
    {
      name: 'priceFrom',
      label: 'Консультація від, грн',
      type: 'number',
      min: 0,
      admin: { description: 'Порожнє — ціна не показується' },
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
