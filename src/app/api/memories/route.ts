import { NextResponse } from 'next/server';
import { session } from '@/lib/supabase';
import { jsonError } from '@/lib/common';
import { body, uuid } from '@/lib/validation';
import { z } from 'zod';
export async function GET() { try { const {db,user}=await session(); if(!user) return jsonError('Sign in to see what HUAI knows.',401); const {data,error}=await db.from('memories').select('*').order('created_at',{ascending:false}); if(error) throw error; return NextResponse.json(data); } catch { return jsonError('Could not load this list.',500); } }
export async function DELETE(req:Request) { try { const {db,user}=await session(); if(!user) return jsonError('Sign in to delete.',401); const parsed=await body(req,z.union([z.object({id:uuid}).strict(),z.object({all:z.literal(true)}).strict()])); if(parsed.error)return parsed.error; const b=parsed.value; let q=db.from('memories').delete().eq('user_id',user.id); if('id' in b) q=q.eq('id',b.id); else if(b.all!==true) return jsonError('Choose what to delete.'); const {error}=await q; if(error) throw error; return NextResponse.json({ok:true}); } catch { return jsonError('Could not delete. Try again.',500); } }
