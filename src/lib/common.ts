import { NextResponse } from 'next/server';
export const jsonError = (message: string, status = 400) => NextResponse.json({ error: message }, { status });
export const text = (v: unknown) => typeof v === 'string' ? v.trim() : '';
// A conservative stop, not a diagnosis. It also runs on the server before a model call.
export const unsafe = (s: string) => /\b(suicid(?:e|al)|kill myself|end my (?:own )?life|take my (?:own )?life|self[ -]?harm|hurt myself|harm myself|cut myself|kill (?:him|her|them|someone|people|myself)|hurt (?:him|her|them|someone|people)|harm (?:him|her|them|someone|people)|shoot (?:him|her|them|someone|people)|stab (?:him|her|them|someone|people))\b/i.test(s);
export const safetyMessage = 'This needs a person, not a decision tool. Contact a trusted person now. If anyone is in immediate danger in Kenya, call 999 or 112.';
export const safety = (s: string) => unsafe(s) ? jsonError(safetyMessage, 422) : null;
