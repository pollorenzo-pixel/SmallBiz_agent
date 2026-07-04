import { useState } from 'react'
import type { FounderProfile, PermissionLevel } from '../types'

export function FounderProfileForm({initial,onSave}:{initial:FounderProfile;onSave:(profile:FounderProfile)=>void}){
 const [profile,setProfile]=useState(initial)
 const set=(key:keyof FounderProfile,value:string|string[]|PermissionLevel)=>setProfile(current=>({...current,[key]:value,updatedAt:new Date().toISOString()}))
 return <form className="founder-profile-form" onSubmit={event=>{event.preventDefault();onSave(profile)}}><div className="profile-grid">
  <label>Founder name<input required value={profile.name} onChange={e=>set('name',e.target.value)}/></label><label>Company name<input required value={profile.companyName} onChange={e=>set('companyName',e.target.value)}/></label>
  <label className="wide">Main projects<textarea required value={profile.mainProjects.join('\n')} onChange={e=>set('mainProjects',e.target.value.split(/\n|,/).map(v=>v.trim()).filter(Boolean))}/><small>One project per line.</small></label>
  <label>Business stage<select value={profile.businessStage} onChange={e=>set('businessStage',e.target.value)}><option value="idea">Idea</option><option value="validating">Validating</option><option value="pre-launch">Pre-launch</option><option value="launched">Launched</option><option value="growing">Growing</option><option value="established">Established</option></select></label>
  <label className="wide">Current priorities<textarea required value={profile.currentPriorities.join('\n')} onChange={e=>set('currentPriorities',e.target.value.split(/\n|,/).map(v=>v.trim()).filter(Boolean))}/><small>One priority per line.</small></label>
  <label>Preferred tone<select value={profile.preferredTone} onChange={e=>set('preferredTone',e.target.value)}><option value="direct">Direct and thoughtful</option><option value="concise">Concise</option><option value="warm">Warm</option><option value="formal">Formal</option></select></label>
  <label>Risk preference<select value={profile.riskPreference} onChange={e=>set('riskPreference',e.target.value)}><option value="cautious">Cautious</option><option value="balanced">Balanced</option><option value="experimental">Experimental with guardrails</option></select></label>
  <label>Default permission level<select value={profile.defaultPermissionLevel} onChange={e=>set('defaultPermissionLevel',Number(e.target.value) as PermissionLevel)}><option value={0}>Level 0 · Read-only</option><option value={1}>Level 1 · Draft action</option><option value={2}>Level 2 · Approval required</option><option value={3}>Level 3 · Restricted</option></select><small>Never overrides workflow safety. Level 3 remains blocked.</small></label>
 </div><button className="profile-submit" type="submit">Save operator profile →</button></form>
}
