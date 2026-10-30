import { z } from 'zod';
import { jsonError } from './common';
// Keep the user's words intact; reject invalid controls and oversized input instead
// of stripping HTML. React renders all text as text, not markup.
export const words = (max = 10000) => z.string().max(max).refine(s => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(s), 'Invalid characters');
export const requiredWords = (max = 10000) => words(max).refine(s => s.trim().length > 0, 'Required');
export const uuid = z.string().uuid();
export async function body<T>(req: Request, schema: z.ZodType<T>): Promise<{value:T; error?:never}|{value?:never;error:ReturnType<typeof jsonError>}> {
 if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return {error:jsonError('Expected JSON.',415)};
 try {
  const reader=req.body?.getReader(); if(!reader) return {error:jsonError('Missing request body.')};
  let size=0, parts:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>32768){await reader.cancel();return {error:jsonError('Request is too large.',413)}}parts.push(value)}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length}
  const result=schema.safeParse(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)));
  return result.success ? {value:result.data} : {error:jsonError('Check the information you entered.')};
 } catch { return {error:jsonError('Invalid request body.')}; }
}
