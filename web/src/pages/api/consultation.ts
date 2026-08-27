import type { APIRoute } from 'astro';

import { cmsEnv, createLead } from '../../lib/cms';

export const prerender = false;

interface ConsultationRequest {
  name: string;
  phone: string;
  service?: string;
  message?: string;
}

/**
 * Accepts consultation requests from the website form and forwards them to
 * Payload CMS (`leads` collection). Payload's afterChange hook notifies the
 * lawyer via Telegram.
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

  const ok = await createLead(cmsEnv(), {
    name,
    phone,
    service: String(body.service ?? '').slice(0, 100),
    message: String(body.message ?? '').slice(0, 5000),
  });

  if (!ok) {
    return Response.json({ error: 'Failed to submit' }, { status: 502 });
  }
  return Response.json({ ok: true });
};
