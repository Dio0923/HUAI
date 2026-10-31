'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { request } from '@/lib/client';

const messages: Record<string, string> = {
 invalid_link: 'This link is missing information or is no longer valid. Request a new one.',
 missing_verifier: 'Open the link in the same browser and on the same device where you requested it. Request a new link if you need to.',
 exchange_failed: 'This link could not sign you in. It may have expired or already been used. Request a new link in this browser.'
};
export default function Login() {
 const [email, setEmail] = useState(''), [terms, setTerms] = useState(false), [privacy, setPrivacy] = useState(false);
 const [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [signedIn, setSignedIn] = useState(false), [mainSite, setMainSite] = useState('');
 useEffect(() => {
  const error = new URLSearchParams(location.search).get('error');
  if (error && messages[error]) setMessage(messages[error]);
  try { const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || ''); if (site.origin !== location.origin) setMainSite(site.origin); } catch {}
  request('/api/auth/status').then(data => setSignedIn(data.signedIn)).catch(() => {});
 }, []);
 async function submit(e: React.FormEvent) {
  e.preventDefault(); setBusy(true); setMessage('');
  try { await request('/api/auth/login', { email, terms, privacy }); setMessage('If the address can be used, a sign-in link will arrive by email. Open it in this browser.'); }
  catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
 }
 return <main className="narrow page login-page"><div className="overline">YOUR PRIVATE SPACE</div><h1>Pick up where<br/><em>you left off.</em></h1>
 {signedIn ? <><p>You are signed in.</p><Link className="button primary" href="/">Go to your decisions <span>→</span></Link></> : <><p>Sign in with a link sent to your email. No password needed.</p>
 {mainSite && <p className="notice">For sign-in, use <a href={`${mainSite}/login`}>the main HUAI address</a>. The email link must return to the same address.</p>}
 <form onSubmit={submit} className="form-stack"><label htmlFor="email">Email address</label><input id="email" type="email" maxLength={254} required autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
 <label className="check-label"><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} required/><span>I agree to the <Link href="/policies/terms">terms of service</Link>.</span></label>
 <label className="check-label"><input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} required/><span>I have read the <Link href="/policies/privacy">privacy notice</Link>.</span></label>
 <p className="form-hint">HUAI is not ready for use by children until a parent or guardian consent process is in place.</p><button className="button primary" disabled={busy || !terms || !privacy || !!mainSite}>{busy ? 'Sending…' : 'Send sign-in link'} <span>→</span></button></form></>}
 {message && <p className="notice" role="status">{message}</p>}</main>;
}
