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
  address: '88000, м. Ужгород, вул. Мальовнича, 2',
  phone: '+38 (050) 96-23-999',
  phoneHref: 'tel:+380509623999',
  phone2: '+38 (097) 720-17-20',
  phone2Href: 'tel:+380977201720',
  email: 'advokatuzhgorod8@ukr.net',
  hours: 'Працюємо цілодобово',
  mapUrl: 'https://maps.google.com/?q=Ужгород,+вул.+Мальовнича,+2',
  description:
    'Адвокат в Ужгороді: консультації та захист у кримінальних, цивільних, сімейних, митних справах, ДТП і ст. 130 КУпАП. 21 рік практики, 99% позитивних рішень.',
  /** Bar certificate («свідоцтво про право на заняття адвокатською діяльністю»). Trust block hides the card while `number` is empty. */
  certificate: {
    number: '21/536',
    issuedAt: '12.07.2006',
    issuedBy: 'Закарпатською обласною КДКА',
  },
  /**
   * Lawyer photos, pre-rendered by `npm run images` into public/img/<base>-{640,1024}.{avif,webp}.
   * Empty base = slot not rendered (layout falls back to the emblem).
   */
  photos: {
    portrait: { base: '', width: 1024, height: 1280 },
    workplace: { base: '', width: 1024, height: 683 },
  },
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
