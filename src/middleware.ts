import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function middleware(req:NextRequest) {
 if(req.nextUrl.pathname.startsWith('/api/') && !['GET','HEAD','OPTIONS'].includes(req.method)) {
  const origin=req.headers.get('origin'), host=req.headers.get('host');
  try { if(!origin || new URL(origin).host!==host) return NextResponse.json({error:'Invalid request origin.'},{status:403}); } catch {return NextResponse.json({error:'Invalid request origin.'},{status:403})}
 }
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key) return NextResponse.next();
 let response=NextResponse.next({request:req});
 const db=createServerClient(url,key,{cookies:{getAll:()=>req.cookies.getAll(),setAll:(all:{name:string;value:string;options:CookieOptions}[])=>{all.forEach(({name,value})=>req.cookies.set(name,value));response=NextResponse.next({request:req});all.forEach(({name,value,options})=>response.cookies.set(name,value,{...options,httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'}))}}});
 const {data:{user}}=await db.auth.getUser();
 if(user&&!req.nextUrl.pathname.startsWith('/api/')){const {data}=await db.from('decisions').select('id').eq('stage','check').eq('safety_stopped',false).limit(1);const id=data?.[0]?.id;if(id&&req.nextUrl.pathname!==`/decision/${id}`)return NextResponse.redirect(new URL(`/decision/${id}`,req.url));}
 return response;
}
export const config={matcher:['/','/history','/calibration','/knows','/decision/:path*','/api/:path*']};
