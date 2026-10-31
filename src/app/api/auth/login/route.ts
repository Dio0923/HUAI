import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { body } from '@/lib/validation';
import { jsonError } from '@/lib/common';
import { z } from 'zod';

export async function POST(req: Request) {
 const parsed = await body(req, z.object({ email: z.string().trim().email().max(254), terms: z.literal(true), privacy: z.literal(true) }).strict());
 if (parsed.error) return parsed.error;
 const site = process.env.NEXT_PUBLIC_SITE_URL;
 if (!site || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return jsonError('Sign-in is not configured yet.', 503);
 try {
  const target = new URL('/auth/callback', new URL(site));
  if (target.protocol !== 'https:' && target.hostname !== 'localhost') return jsonError('Sign-in is not configured yet.', 503);
  // The verifier cookie is host-only; starting on a different host makes the link fail.
  if (req.headers.get('origin') !== target.origin) return jsonError('Open the main HUAI address before signing in.', 409);
  const db = await supabase();
  const { error } = await db.auth.signInWithOtp({ email: parsed.value.email, options: { emailRedirectTo: target.toString() } });
  if (error) {
   const known = ['over_email_send_rate_limit', 'over_request_rate_limit', 'email_provider_disabled'];
   console.warn('Sign-in request failed', { code: error.code && known.includes(error.code) ? error.code : 'other', status: error.status });
   return jsonError(error.status === 429 ? 'Too many requests. Wait a little and try again.' : 'Could not send the link. Try again later.', error.status === 429 ? 429 : 502);
  }
  return NextResponse.json({ ok: true });
 } catch {
  console.warn('Sign-in request failed', { code: 'unexpected' });
  return jsonError('Could not send the link. Try again later.', 500);
 }
}
