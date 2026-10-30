import { NextResponse } from 'next/server';
import { getDecision, type Params } from '@/lib/decision';
import { critique } from '@/lib/ai';
import { jsonError, safety } from '@/lib/common';
import { body } from '@/lib/validation';
import { z } from 'zod';
export async function POST(req:Request,{params}:Params) { try { const parsed=await body(req,z.object({consent:z.literal(true)}).strict()); if(parsed.error)return parsed.error; const r=await getDecision((await params).id); if(r.error) return r.error; if(r.data.stage!=='critique') return jsonError('Commit your view first.',409); const blocked=safety((r.data.context||'')+' '+(r.data.own_view_original||'')); if(blocked) return blocked; if(r.data.ai_critique) return NextResponse.json(r.data.ai_critique); const result=await critique(r.data.context,r.data.own_view_original); const {error}=await r.db!.from('decisions').update({ai_critique:result}).eq('id',r.data.id).eq('stage','critique'); if(error) throw error; return NextResponse.json(result); } catch { return jsonError('Could not create a critique. Your words are saved. Try again, or skip this step.',500); } }
