/**
 * Site-wide editable data.
 * Part 2 will move this into Payload CMS globals — keep the shape flat and
 * serializable so the swap is a fetch call, not a refactor.
 */

export const site = {
  name: 'АБ «Марина В.Г. Юридичний захист»',
  shortName: 'Юридичний захист',
  lawyer: 'Марина Віктор Георгійович',
  city: 'Ужгород',
  address: '88000, м. Ужгород, вул. Собранецька, 46, офіс 7',
  phone: '+38 (050) 96-23-999',
  phoneHref: 'tel:+380509623999',
  email: 'advokatuzhgorod8@ukr.net',
  hours: 'Пн–Пт: 9:00–18:00, за попереднім записом — цілодобово',
  mapUrl: 'https://maps.google.com/?q=Ужгород,+вул.+Собранецька+46',
  description:
    'Адвокатське бюро в Ужгороді. Кримінальні, цивільні, адміністративні, митні та сімейні справи. 21 рік практики, 99% позитивних судових рішень.',
} as const;

/** Social links — hrefs are placeholders until the lawyer provides real profiles (editable in CMS later). */
export const socials = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'Telegram', href: '#', icon: 'telegram' },
  { name: 'Viber', href: '#', icon: 'viber' },
  { name: 'WhatsApp', href: '#', icon: 'whatsapp' },
] as const;

export const stats = [
  { value: 21, suffix: '+', label: 'рік юридичної практики' },
  { value: 370, suffix: '+', label: 'судових справ у провадженні' },
  { value: 99, suffix: '%', label: 'позитивних судових рішень' },
  { value: 1250, suffix: '+', label: 'судових засідань на рік' },
] as const;
