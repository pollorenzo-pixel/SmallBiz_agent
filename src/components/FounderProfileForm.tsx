import { useState } from 'react'
import type { FounderProfile } from '../types'

const goalOptions=['Get organised','Find customers','Improve product/service','Create content/marketing','Handle admin/finance','Research ideas/tools','Build software/features']
export function FounderProfileForm({initial,onSave}:{initial:FounderProfile;onSave:(profile:FounderProfile)=>void}){
 const [profile,setProfile]=useState(initial)
 const set=<K extends keyof FounderProfile>(key:K,value:FounderProfile[K])=>setProfile(current=>({...current,[key]:value,updatedAt:new Date().toISOString()}))
 return <form className="founder-profile-form profile-form" onSubmit={event=>{event.preventDefault();onSave({...profile,mainProjects:profile.projects,currentPriorities:profile.goals,onboardingCompleted:true})}}><div className="profile-grid">
  <label>Your name<input required value={profile.name} onChange={e=>set('name',e.target.value)}/></label><label>Business name<input required value={profile.companyName} onChange={e=>set('companyName',e.target.value)}/></label>
  <label>Business type<input value={profile.businessType} onChange={e=>set('businessType',e.target.value)}/></label><label>Preferred tone<select value={profile.preferredTone} onChange={e=>set('preferredTone',e.target.value)}><option>Friendly</option><option>Professional</option><option>Direct</option><option>Founder-led</option></select></label>
  <label className="wide">Projects<textarea value={profile.projects.join('\n')} onChange={e=>set('projects',e.target.value.split(/\n|,/).map(v=>v.trim()).filter(Boolean))}/><small>One project per line.</small></label>
 </div><fieldset><legend>What do you want help with?</legend><div className="integration-checks">{goalOptions.map(goal=><label key={goal}><input type="checkbox" checked={profile.goals.includes(goal)} onChange={()=>set('goals',profile.goals.includes(goal)?profile.goals.filter(item=>item!==goal):[...profile.goals,goal])}/>{goal}</label>)}</div></fieldset>
 <label>Help level<select value={profile.helpLevel} onChange={e=>set('helpLevel',e.target.value)}><option>Just suggestions</option><option>Draft things for me</option><option>Prepare actions for review</option><option>I want automation later</option></select></label>
 <button className="profile-submit" type="submit">Save your setup</button></form>
}
