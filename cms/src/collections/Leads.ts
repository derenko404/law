import type { CollectionConfig } from 'payload'

import { sendTelegramMessage } from '../lib/telegram'

/** Consultation requests submitted from the website form. */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'service', 'status', 'createdAt'],
  },
  access: {
    // Created by the website via an authenticated API key; managed in admin.
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', label: 'Імʼя', type: 'text', required: true, maxLength: 200 },
    { name: 'phone', label: 'Телефон', type: 'text', required: true, maxLength: 30 },
    { name: 'service', label: 'Тип питання', type: 'text', maxLength: 100 },
    { name: 'message', label: 'Опис проблеми', type: 'textarea', maxLength: 5000 },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Нова', value: 'new' },
        { label: 'В роботі', value: 'in-progress' },
        { label: 'Опрацьована', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        const esc = (s: unknown) =>
          String(s ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')

        const lines = [
          '<b>Нова заявка з сайту</b>',
          `<b>Імʼя:</b> ${esc(doc.name)}`,
          `<b>Телефон:</b> ${esc(doc.phone)}`,
        ]
        if (doc.service) lines.push(`<b>Тип питання:</b> ${esc(doc.service)}`)
        if (doc.message) lines.push(`<b>Опис:</b> ${esc(doc.message)}`)

        try {
          await sendTelegramMessage(lines.join('\n'))
        } catch (err) {
          console.error('Telegram notification failed:', err)
        }
      },
    ],
  },
}
