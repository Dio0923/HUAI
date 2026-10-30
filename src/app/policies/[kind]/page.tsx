import Link from 'next/link';
import { notFound } from 'next/navigation';
const policies: Record<string,{title:string; sections:{heading:string; content:React.ReactNode}[]}> = {
 privacy:{title:'Privacy notice',sections:[
  {heading:'About this draft',content:<>This notice is a launch draft. The operator’s legal name, address and contact details have not been provided. It needs legal review before real users rely on it.</>},
  {heading:'Information used',content:<>Your email is used for passwordless sign-in. Your decision text, view, optional confidence, decision, review and saved facts are stored to provide the journal. Your browser can also hold unfinished text and offline copies. Avoid entering information you do not need to share.</>},
  {heading:'Service providers',content:<>Supabase provides authentication and storage. If you choose a critique, your decision and committed view are sent to Google’s Gemini service through the Vercel AI SDK. The app is intended to run on Vercel. Providers’ processing, locations, retention and international transfers need review before launch. Do not include another person’s private information without a reason.</>},
  {heading:'Children',content:<>HUAI is not ready for use by children until an appropriate age and parent or guardian consent process is in place. A self-declaration is not verification. The operator must establish and review this process before launch.</>},
  {heading:'Delete your information',content:<>Use <Link href="/account">Account and data</Link> to delete your account and stored records when deletion is configured. The app clears its local copies on the current device; copies on other devices must be cleared there. Provider backups and their deletion schedules must be confirmed before launch.</>},
  {heading:'Contact and rights',content:<>Business name, address, privacy contact and retention periods: not yet provided. The operator must add them and explain applicable access, correction, deletion and complaint rights before launch.</>}
 ]},
 terms:{title:'Terms of service',sections:[
  {heading:'About this draft',content:<>These terms are a launch draft, not a final legal agreement. The operator’s legal name, contact and address have not been provided. They need legal review before launch.</>},
  {heading:'Using HUAI',content:<>HUAI is a decision journal. You make your own decisions. Its critique may be incomplete or wrong and is not medical, legal or financial advice. Protect your sign-in link and do not use the service to harm others.</>},
  {heading:'Your words',content:<>You write your own decisions and are responsible for information you enter. Do not share sensitive information unnecessarily. The <Link href="/policies/privacy">privacy notice</Link> describes storage and processing.</>},
  {heading:'Children',content:<>Use by children requires an appropriate age and parent or guardian consent process. That process has not yet been established.</>},
  {heading:'Fees and termination',content:<>There are no payments or subscriptions in this version. You can request deletion from <Link href="/account">Account and data</Link> when deletion is configured. Final terms, availability, disputes and operator details remain to be determined.</>}
 ]},
 refund:{title:'Refund policy',sections:[
  {heading:'This version',content:<>HUAI Check V1 has no payments, subscriptions or fees, so it does not collect payments to refund.</>},
  {heading:'If that changes',content:<>A reviewed refund policy and clear prices will be needed before payments are introduced. Business details have not yet been provided.</>}
 ]},
 cookies:{title:'Cookie policy',sections:[
  {heading:'Cookies and local storage',content:<>Essential authentication cookies keep you signed in. They are HTTP-only, use SameSite protection and are secure on HTTPS. The sign-in flow also uses a temporary verification cookie.</>},
  {heading:'On this device',content:<>Local storage saves unfinished text, offline history and calibration, and whether you dismissed the storage notice. A service worker caches application files and the history and calibration screens for offline use. These copies remain on the device until cleared.</>},
  {heading:'No optional tracking',content:<>This version does not intentionally use advertising, analytics or tracking cookies. There are no optional cookie categories to enable. Clear browser storage to remove local copies; doing so can sign you out and remove unsaved work.</>},
  {heading:'About this draft',content:<>This policy needs review alongside the actual deployment and providers. The operator’s business and contact details have not yet been provided.</>}
 ]}
};
export default async function Policy({params}:{params:Promise<{kind:string}>}){const {kind}=await params;const p=policies[kind];if(!p)notFound();return <main className="narrow page policy"><div className="overline">INFORMATION · DRAFT</div><h1>{p.title}</h1>{p.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.content}</p></section>)}<p><Link href="/">← Back to HUAI</Link></p></main>}
