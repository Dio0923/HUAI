import { session } from './supabase';
import { jsonError, safetyMessage } from './common';
import { uuid } from './validation';
export async function getDecision(id: string) { if(!uuid.safeParse(id).success) return {error:jsonError('Invalid decision ID.')}; const {db,user}=await session(); if(!user) return {error:jsonError('Sign in to continue.',401)}; const {data,error}=await db.from('decisions').select('*').eq('id',id).single(); if(error || !data) return {error:jsonError('Decision not found.',404)}; if(data.safety_stopped) return {error:jsonError(safetyMessage,422)}; return {db,data}; }
export type Params = { params: Promise<{id:string}> };
