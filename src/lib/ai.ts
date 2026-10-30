import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
const schema = z.object({ facts: z.array(z.string()).min(1), assumptions: z.array(z.string()).min(1), missing: z.array(z.string()).min(1), options: z.array(z.string()).min(2).max(3), uncertainty: z.string().min(1) });
export async function critique(context: string, view: string | null) {
 const prompt = `You are HUAI Check, a thinking coach, not a decision maker. Critique the user's thinking in plain short English, under 250 words total. Never recommend, choose, diagnose, infer feelings, profile a third person, or write a final decision. Separate what the user stated from unverified assumptions. Label the facts as the user's claims, not verified facts. Give at least two genuinely distinct alternatives not mentioned by the user; explicitly mark one as a reframe of the question. State what you cannot know or verify. For medical, legal or consequential financial decisions say you cannot verify domain facts and a qualified person needs to be involved. For sensitive decisions involving a young minor, suggest a trusted adult. Reference the commitment by quoting a short exact phrase from it in facts or assumptions. If there is no view, reference the user's decision instead. Never use "you should", "I would", or "the best option is". No preamble.\nDecision: ${context}\nUser's committed view: ${view ?? '(No view yet)'}`;
 let last: unknown;
 for (let attempt = 0; attempt < 2; attempt++) {
  try {
   const { object } = await generateObject({ model: google('gemini-2.5-flash-lite'), schema, prompt });
   const all = JSON.stringify(object);
   if (/\byou should\b|\byou ought to\b|\bi would\b|\bi['’]d\b|\bthe best (?:option|choice)\b|\bi recommend\b|\bmy recommendation\b/i.test(all) || all.split(/\s+/).length > 250 || !/refram/i.test(object.options.join(' '))) throw new Error('Critique did not meet the format.');
   // Require a literal, meaningful fragment of the user's own words.
   const source = (view || context).toLowerCase();
   const referenced = [...object.facts, ...object.assumptions].some(x => {
     const quotes = [...x.matchAll(/[“"]([^”"]{5,})[”"]/g)].map(m => m[1].toLowerCase());
     return quotes.some(q => source.includes(q));
   });
   if (!referenced) throw new Error('Critique did not reference the user’s words.');
   return object;
  } catch (e) { last = e; }
 }
 throw last;
}
