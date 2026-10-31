'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { request } from '@/lib/client';

type Decision = { id: string; stage: string; safety_stopped: boolean; outcome: string | null; review_due_at: string };
export default function Home() {
 const [due, setDue] = useState<number | null>(null), [draft, setDraft] = useState<string | null>(null);
 useEffect(() => {
  request('/api/decisions').then((rows: Decision[]) => {
   setDue(rows.filter(d => d.stage === 'saved' && !d.outcome && new Date(d.review_due_at) <= new Date()).length);
   setDraft(rows.find(d => d.stage !== 'saved' && !d.safety_stopped)?.id || null);
  }).catch(() => {});
 }, []);
 return <main className="home">
  <div className="home-top"><span>THE DECISION JOURNAL</span><span>THINK FIRST. DECIDE FOR YOURSELF.</span></div>
  <section className="hero" aria-labelledby="home-title">
   <div className="hero-copy"><div className="overline">HUMAN + ARTIFICIAL INTELLIGENCE</div>
    <h1 id="home-title">Your decision.<br/><em>Your own words.</em></h1>
    <p>Bring a decision. Write what you think first. HUAI helps you take another look, without deciding for you.</p>
    <Link className="button primary hero-button" href={draft ? `/decision/${draft}` : '/decision/new'}>{draft ? 'Continue your decision' : 'Start a decision'} <span aria-hidden="true">→</span></Link>
    <div className="hero-foot"><span/> YOUR THINKING COMES FIRST</div>
   </div>
   <aside className="hero-note"><span className="hero-note-label">THE IDEA / 01</span><p className="hero-note-quote">A little space between <em>thinking</em> and deciding.</p><div className="hero-note-rule"/><p className="hero-note-detail">You bring the thinking.<br/>HUAI helps you look again.</p><span className="hero-note-bottom">HUMAN + AI, NOT AI INSTEAD.</span></aside>
  </section>
  <section className="home-bottom" aria-label="Your decision record">
   <Link className="home-tile review-tile" href="/history?status=due"><div><span className="tile-index">01 / COME BACK TO IT</span><h2>Decisions to review</h2><p>{due === null ? 'Your review queue appears after sign-in.' : 'See what happened after you decided.'}</p></div><div className="tile-end"><strong>{due === null ? '—' : String(due).padStart(2, '0')}</strong><span aria-hidden="true">→</span></div></Link>
   <Link className="home-tile calibration-tile" href="/calibration"><div><span className="tile-index">02 / THE LONGER VIEW</span><h2>See your calibration</h2><p>Get to know your judgement over time.</p></div><div className="tile-end"><span aria-hidden="true">→</span></div></Link>
  </section>
 </main>;
}
