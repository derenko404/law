import type { APIRoute } from 'astro';

export const prerender = false;

interface ConsultationRequest {
  name: string;
  phone: string;
  service?: string;
  message?: string;
}

/**
 * Accepts consultation requests from the landing form.
 *
 * Part 2/3 integration point: this handler will forward the request to
 * Payload CMS (persist the lead) and to the Telegram bot (notify the lawyer).
 * For now it validates and acknowledges.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: ConsultationRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  if (!name || !phone) {
    return Response.json({ error: 'Name and phone are required' }, { status: 422 });
  }
  if (name.length > 200 || phone.length > 30 || String(body.message ?? '').length > 5000) {
    return Response.json({ error: 'Field too long' }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    service: String(body.service ?? '').slice(0, 100),
    message: String(body.message ?? '').slice(0, 5000),
    receivedAt: new Date().toISOString(),
  };

  // TODO(part-2): POST lead to Payload CMS collection `consultation-requests`.
  // TODO(part-3): notify lawyer via Telegram bot.
  console.log('consultation request', lead);

  return Response.json({ ok: true });
};
