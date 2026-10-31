import { NextResponse } from 'next/server';
import { session } from '@/lib/supabase';
export async function GET() {
 try { const { user } = await session(); return NextResponse.json({ signedIn: !!user }); }
 catch { return NextResponse.json({ signedIn: false }, { status: 503 }); }
}
