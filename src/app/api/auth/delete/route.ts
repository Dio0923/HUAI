import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { session } from '@/lib/supabase';
import { body } from '@/lib/validation';
import { jsonError } from '@/lib/common';
import { z } from 'zod';
export async function POST(req:Request){
 const parsed=await body(req,z.object({confirmation:z.literal('DELETE')}).strict());if(parsed.error)return parsed.error;
 try {const {db,user}=await session();if(!user)return jsonError('Sign in to delete your data.',401);
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return jsonError('Deletion is not configured. Contact the product owner.',503);
  const admin=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});const {error}=await admin.auth.admin.deleteUser(user.id);
  if(error)return jsonError('Could not delete your account. Try again later.',500);
  await db.auth.signOut({scope:'local'});return NextResponse.json({ok:true});
 }catch{return jsonError('Could not delete your account. Try again later.',500)}
}
