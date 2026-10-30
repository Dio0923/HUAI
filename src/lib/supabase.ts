import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function supabase() {
 const jar=await cookies(); const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key) throw new Error('Supabase is not configured.');
 return createServerClient(url,key,{cookies:{getAll:()=>jar.getAll(),setAll:(all:{name:string;value:string;options:CookieOptions}[])=>{try{all.forEach(({name,value,options})=>jar.set(name,value,{...options,httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'}))}catch{}}}});
}
export async function session(){const db=await supabase();const {data:{user}}=await db.auth.getUser();return {db,user};}
