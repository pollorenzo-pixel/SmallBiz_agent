import type { BusinessProfile } from '../types'
import { BusinessProfileForm, emptyProfile } from '../components/BusinessProfileForm'
import { Badge } from '../components/Badge'

export function OnboardingPage({ onComplete }:{onComplete:(profile:BusinessProfile)=>void}) {
 return <main className="onboarding-page"><section className="onboarding-shell"><header><span className="onboarding-logo">S</span><div><span className="eyebrow">SMALLBIZ AGENT · LOCAL MEMORY</span><h1>Tell your AI team what you’re building.</h1><p>This one-time setup gives workflows useful business context. Everything stays in this browser and can be edited or deleted at any time.</p></div><Badge tone="live">Level 0 · local only</Badge></header><div className="memory-notice"><b>No cloud sync. No secrets. No external action.</b><span>Future Supabase memory must use authentication, RLS, and server-side controls.</span></div><BusinessProfileForm initial={emptyProfile()} onSave={onComplete} submitLabel="Complete setup"/></section></main>
}
