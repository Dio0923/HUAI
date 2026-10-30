import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Shell } from './shell';
import { StorageNotice } from './storage-notice';
export const metadata: Metadata = { title: 'HUAI Check', description: 'Think for yourself, with a little perspective.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Shell><header className="header"><Link className="brand" href="/"><span className="brand-mark">h<span>+</span></span><span>HUAI<span className="brand-dot">.</span></span></Link><nav aria-label="Main navigation"><Link href="/history">History</Link><Link href="/calibration">Calibration</Link><Link href="/knows">What HUAI knows</Link></nav><span className="header-note">HUMAN + AI</span></header>{children}<footer><span>HUAI CHECK <b aria-hidden="true">✳</b></span><span>YOUR THINKING, KEPT YOURS.</span><div className="footer-links"><Link href="/policies/privacy">Privacy</Link><Link href="/policies/terms">Terms</Link><Link href="/policies/refund">Refunds</Link><Link href="/policies/cookies">Cookies</Link><Link href="/account">Account &amp; data</Link><Link href="/login">Sign in</Link></div></footer><StorageNotice/></Shell></body></html>; }
