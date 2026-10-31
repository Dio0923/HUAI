# HUAI Check

A small decision journal: the user commits a view before an optional structured critique, writes their own decision, then returns to review it. No chat or external actions.

## Run locally

1. Install Node.js 20 or later and run `npm install`.
2. Create a Supabase project. Run `supabase/schema.sql` in its SQL editor. The tables use row-level security. The extra `stage` and `safety_stopped` fields support the gates; `review_commit_effect` stores the optional review answer. Drafts use empty final-decision fields and are excluded from calibration.
3. Copy `.env.example` to `.env.local` and fill in the Supabase project URL, its **anon/publishable** key, the site origin and a Google AI Studio key. Add the server-only service-role key to enable account deletion. Never put a Supabase service-role key in a public environment variable.
4. In Supabase Auth, enable email magic links and add `http://localhost:3000/auth/callback` and your deployed `/auth/callback` URL to the redirect allowlist. Configure an email provider appropriate for real users.
5. Run `npm run dev` and open the app. `npm run build` checks the production build.

The model is configured in `src/lib/ai.ts`. Verify the current Gemini model availability and free-tier limits before relying on them. The critique is generated only after a commitment; if it fails validation twice, the user can retry or skip. Inputs and unfinished checks are kept in the browser as well as saved stages in the database. History and calibration are cached on the device after being opened online. Avoid shared devices for private decisions.

## Before launch

- Deploy with the environment variables above, and configure an **external** scheduled request to `/api/health`. The route queries Supabase and returns 503 if the database cannot be reached. No external cron is configured by this repository; check that the actual requests are firing and satisfy current Supabase activity requirements.
- The safety stop uses a conservative phrase filter, not a comprehensive detection system. It can miss indirect wording and cannot guarantee safety. Have the safety flow and Kenyan support information reviewed before real users, especially minors, use the app.
- Model output is schema-checked and screened for a few prohibited phrases, but this cannot guarantee semantic compliance, novel options, or domain-specific warnings. Review real outputs before launch.
- Verify the flow with real accounts, including cross-user isolation, the offline cache, slow connections, magic links, and the seven-day minimum. The brief's one-minute-ahead review example conflicts with its stated seven-day minimum; this implementation follows the seven-day rule.

## Security and privacy launch checklist

This is a working draft, **not** a compliance certification. Review it against the OWASP Top 10 and obtain qualified legal and security review before accepting real users, especially children.

- Database access uses Supabase/PostgREST's structured filter and insert/update APIs, not interpolated SQL. User IDs are taken from the verified session, and RLS scopes every row to `auth.uid()`. Keep RLS enabled; review schema changes and test isolation with two real accounts. Application inputs are bounded and validated server-side; free text is preserved and React escapes it instead of rendering it as HTML. Database length checks also apply to direct PostgREST access. Check all new inputs and outputs the same way.
- No secrets belong in the repository, client-side code or `NEXT_PUBLIC_` variables. Configure deployment secrets in the hosting provider's secret store. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a public, RLS-limited key, not the service-role key. For self-service account deletion, configure `SUPABASE_SERVICE_ROLE_KEY` **server-side only**; it has elevated privileges. Restrict access, rotate it if exposed, and validate cascading deletion and provider backup retention. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS site origin and allow its callback in Supabase.
- Authentication is passwordless by design, so there are no passwords to hash and bcrypt is not applicable. The server performs the magic-link flow and sets HTTP-only, SameSite=Lax cookies (Secure in production). State-changing app routes require a same-origin request. Configure HTTPS, Supabase email rate limits and a trusted email provider; validate the auth flow and session revocation in the deployed environment.
- Terms and privacy acknowledgements and the optional model-processing checkbox are not a substitute for a reviewed consent-recording process. Child age verification and parent/guardian consent are **not implemented** and are a launch blocker. The operator must design a legally appropriate, verifiable flow and review it before children use HUAI. Do not infer compliance from the current checkboxes.
- Policy pages are drafts. Supply the operator's legal name, address, privacy/contact channel, actual retention and deletion schedules, data-transfer details, and complaint procedures; have the texts reviewed for the relevant jurisdictions. Configure and verify the deletion endpoint before promising self-service deletion. Local copies on other devices and backups need separate handling.
- Authentication emails are transactional and are sent by Supabase; this app has no marketing emails or mailing list. Review the Supabase email templates and delivery settings. If marketing is ever added, provide a working unsubscribe link and honor opt-outs; do not add marketing to V1.
- Third-party review (current lockfile): Next.js, React, Supabase SSR/JS, Zod and Tailwind report MIT licenses; the AI SDK and Google provider report Apache-2.0. The app uses system fonts and CSS/Unicode artwork, with no external image or font assets. Review all transitive licenses and the privacy/security terms, data locations and retention of Supabase, Google and Vercel before launch. `npm audit --omit=dev` reported zero known vulnerabilities at the time of this update; repeat it and reassess dependencies regularly.
- No ads, analytics, paid plans, fees, reviews or testimonials are included. The storage notice describes essential cookies and local storage rather than manufacturing optional tracking choices. Recheck claims, consent wording, keyboard navigation, contrast and screen-reader use on real devices before launch. Accessibility and OWASP adherence cannot be guaranteed by code changes alone.

### Sign-in troubleshooting

Use the exact main address configured in `NEXT_PUBLIC_SITE_URL` to request a link; the app warns if sign-in starts on a different host, because the verification cookie is host-only. Open the latest link on the same device and in the same browser. The callback now distinguishes a missing verification cookie from a failed or expired exchange, without logging the link, code, email or token. The login page indicates when the session is already signed in. A local mock can check cookie and callback mechanics, but a real emailed-link test is still required after deployment. The visual constraints are recorded in `DESIGN.md`.
