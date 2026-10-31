import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Shell } from './shell';
import { StorageNotice } from './storage-notice';
export const metadata: Metadata = { title: 'HUAI Check', description: 'A decision journal for thinking in your own words.' };
export default function Layout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body><Shell>
  <header className="header"><Link className="brand" href="/" aria-label="HUAI Check home"><span className="brand-mark" aria-hidden="true">h<span>+</span></span><span className="brand-name">HUAI <small>CHECK</small></span></Link>
   <nav aria-label="Main navigation"><Link href="/history">History</Link><Link href="/calibration">Calibration</Link><Link href="/knows">What HUAI knows</Link></nav><span className="header-note">HUMAN + ARTIFICIAL INTELLIGENCE</span>
  </header>
  {children}
  <footer><div className="footer-brand"><strong>HUAI<span>+</span></strong><span>A DECISION JOURNAL<br/>FOR YOUR OWN THINKING.</span></div><div className="footer-links"><Link href="/policies/privacy">Privacy</Link><Link href="/policies/terms">Terms</Link><Link href="/policies/refund">Refunds</Link><Link href="/policies/cookies">Cookies</Link><Link href="/account">Account &amp; data</Link><Link href="/login">Sign in</Link></div></footer>
  <StorageNotice/>
 </Shell></body></html>;
}
