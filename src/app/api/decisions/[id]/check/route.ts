import { NextResponse } from 'next/server';
import { getDecision, type Params } from '@/lib/decision';
import { jsonError } from '@/lib/common';
export async function POST(_:Request,{params}:Params) { try { const r=await getDecision((await params).id); if(r.error) return r.error; if(r.data.stage==='check') return NextResponse.json(r.data); if(r.data.stage!=='critique') return jsonError('Commit your view first.',409); const {data,error}=await r.db!.from('decisions').update({stage:'check'}).eq('id',r.data.id).eq('stage','critique').select().single(); if(error) throw error; return NextResponse.json(data); } catch { return jsonError('Could not open Human Check. Try again.',500); } }
