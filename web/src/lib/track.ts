/**
 * Conversion events for whichever analytics is active: Cloudflare Zaraz (prod),
 * in-page GA4 and/or Meta Pixel (see Analytics.astro). Never throws.
 */
type AnalyticsWindow = Window & {
  zaraz?: { track: (event: string, params?: Record<string, unknown>) => void };
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

/** Meta Pixel standard events for our GA4-style event names. */
const pixelEvents: Record<string, string> = {
  generate_lead: 'Lead',
  phone_click: 'Contact',
  messenger_click: 'Contact',
};

export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  const w = window as AnalyticsWindow;
  try {
    w.zaraz?.track(event, params);
    w.gtag?.('event', event, params);
    const pixelEvent = pixelEvents[event];
    if (pixelEvent) w.fbq?.('track', pixelEvent, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** Contact-link clicks (tel:, Viber, Telegram, WhatsApp) anywhere on the page. */
export function trackContactClicks(): void {
  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    const placement = link.closest('[data-track-area]')?.getAttribute('data-track-area') ?? 'page';
    if (href.startsWith('tel:')) {
      trackEvent('phone_click', { placement });
      return;
    }
    const messenger = href.startsWith('viber:')
      ? 'viber'
      : /(^|\/\/)(t\.me|telegram\.me)\//.test(href)
        ? 'telegram'
        : /wa\.me|whatsapp/.test(href)
          ? 'whatsapp'
          : null;
    if (messenger) trackEvent('messenger_click', { messenger, placement });
  });
}
