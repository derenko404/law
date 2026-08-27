import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Налаштування сайту',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Телефон (як показується)', type: 'text', required: true },
        { name: 'phoneHref', label: 'Телефон (tel:-посилання)', type: 'text', required: true },
      ],
    },
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'address', label: 'Адреса', type: 'text', required: true },
    { name: 'hours', label: 'Графік роботи', type: 'text', required: true },
    { name: 'mapUrl', label: 'Посилання на карту', type: 'text', required: true },
    {
      name: 'socials',
      label: 'Соцмережі',
      type: 'array',
      fields: [
        {
          name: 'icon',
          label: 'Мережа',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Telegram', value: 'telegram' },
            { label: 'Viber', value: 'viber' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        { name: 'href', label: 'Посилання', type: 'text', required: true },
      ],
    },
    {
      name: 'stats',
      label: 'Статистика (цифри на головній)',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'value', label: 'Число', type: 'number', required: true },
        { name: 'suffix', label: 'Суфікс (+, %)', type: 'text', defaultValue: '+' },
        { name: 'label', label: 'Підпис', type: 'text', required: true },
      ],
    },
    {
      name: 'extraAreas',
      label: 'Додаткові сфери (чипси під послугами)',
      type: 'array',
      fields: [{ name: 'title', label: 'Назва', type: 'text', required: true }],
    },
  ],
}
