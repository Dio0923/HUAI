'use client';
import { useEffect } from 'react';
export function Shell({children}:{children:React.ReactNode}) {
 useEffect(()=>{ if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{}); const guard=(e:MouseEvent)=>{ const link=(e.target as HTMLElement).closest('a'); if(link && sessionStorage.getItem('huai-check-required')==='1' && new URL(link.href).pathname!==location.pathname){ e.preventDefault(); alert('Finish your Human Check before leaving this screen.'); } }; const unload=(e:BeforeUnloadEvent)=>{if(sessionStorage.getItem('huai-check-required')==='1'){e.preventDefault(); e.returnValue='';}}; document.addEventListener('click',guard); window.addEventListener('beforeunload',unload); return ()=>{document.removeEventListener('click',guard);window.removeEventListener('beforeunload',unload)}; },[]);
 return <>{children}</>;
}
