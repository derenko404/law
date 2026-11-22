/** Direct-contact links (tap-to-call, Viber, Telegram, WhatsApp) shared by the header and the mobile call bar. */

export interface ContactLinks {
  phone: string;
  phoneHref: string;
  viber: string;
  telegram: string;
  whatsapp: string;
}

interface ContactSource {
  phone: string;
  phoneHref: string;
  socials?: { icon: string; href: string }[];
}

/**
 * Messenger links come from the CMS socials when the lawyer set them;
 * otherwise they are derived from the phone number, so the buttons always work.
 */
export function getContactLinks({ phone, phoneHref, socials = [] }: ContactSource): ContactLinks {
  const digits = phoneHref.replace(/\D/g, '');
  const findSocial = (icon: string) => socials.find((s) => s.icon === icon)?.href;
  return {
    phone,
    phoneHref,
    viber: findSocial('viber') ?? `viber://chat?number=%2B${digits}`,
    telegram: findSocial('telegram') ?? `https://t.me/+${digits}`,
    whatsapp: findSocial('whatsapp') ?? `https://wa.me/${digits}`,
  };
}
