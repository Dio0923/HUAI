import { NextResponse } from 'next/server';
import { getDecision, type Params } from '@/lib/decision';
import { jsonError } from '@/lib/common';
export async function GET(_:Request,{params}:Params) { try { const r=await getDecision((await params).id); return r.error || NextResponse.json(r.data); } catch { return jsonError('Could not load this decision.',500); } }
