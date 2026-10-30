export async function request(url:string, body?:unknown) { const res=await fetch(url, body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const data=await res.json(); if(!res.ok) throw new Error(data.error||'Something went wrong. Try again.'); return data; }
export function date(value:string) { return new Date(value).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
export function useCacheKey(key:string) { return `huai-cache-${key}`; }
