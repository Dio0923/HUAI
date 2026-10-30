import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export async function GET(req:Request) {
 const url=new URL(req.url),code=url.searchParams.get('code');
 if(!code||!/^[A-Za-z0-9_-]{1,2048}$/.test(code)) return NextResponse.redirect(new URL('/login',url.origin));
 try {const db=await supabase();const {error}=await db.auth.exchangeCodeForSession(code);if(error) return NextResponse.redirect(new URL('/login',url.origin));} catch {return NextResponse.redirect(new URL('/login',url.origin));}
 return NextResponse.redirect(new URL('/',url.origin));
}
