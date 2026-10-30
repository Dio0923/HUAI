'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export function StorageNotice(){const [visible,setVisible]=useState(false);useEffect(()=>{try{setVisible(localStorage.getItem('huai-storage-notice')!=='seen')}catch{setVisible(true)}},[]);if(!visible)return null;return <section className="storage-notice" aria-label="Cookie and storage notice"><div><strong>Cookies and device storage</strong><p>HUAI uses essential sign-in cookies and stores drafts and offline copies on this device. There are no optional tracking cookies. <Link href="/policies/cookies">Read the cookie policy</Link>.</p></div><button className="button primary" onClick={()=>{try{localStorage.setItem('huai-storage-notice','seen')}catch{}setVisible(false)}}>Understood</button></section>}
