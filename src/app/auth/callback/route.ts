import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
 const url = new URL(req.url);
 const code = url.searchParams.get('code');
 const fail = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, url.origin));
 if (!code || !/^[A-Za-z0-9_-]{1,2048}$/.test(code)) return fail('invalid_link');
 // The verifier is deliberately HTTP-only. Never place it or the code in logs.
 const jar = await cookies();
 if (!jar.getAll().some(cookie => cookie.name.endsWith('-code-verifier'))) return fail('missing_verifier');
 try {
  const db = await supabase();
  const { error } = await db.auth.exchangeCodeForSession(code);
  if (error) {
   const known = ['flow_state_expired', 'flow_state_not_found', 'bad_code_verifier', 'otp_expired'];
   console.warn('Sign-in exchange failed', { code: error.code && known.includes(error.code) ? error.code : 'other', status: error.status });
   return fail('exchange_failed');
  }
 } catch {
  console.warn('Sign-in exchange failed', { code: 'unexpected' });
  return fail('exchange_failed');
 }
 return NextResponse.redirect(new URL('/', url.origin));
}
