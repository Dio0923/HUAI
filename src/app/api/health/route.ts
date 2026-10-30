import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export async function GET() { try { const db=await supabase(); const {error}=await db.from('decisions').select('id').limit(1); if(error) throw error; return NextResponse.json({ok:true}); } catch { return NextResponse.json({ok:false},{status:503}); } }
