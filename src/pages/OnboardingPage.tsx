import { useState } from 'react'
import type { FounderProfile } from '../types'

const goals=['Get organised','Find customers','Improve product/service','Create content/marketing','Handle admin/finance','Research ideas/tools','Build software/features']
const tones=['Friendly','Professional','Direct','Founder-led']
const helpLevels=['Just suggestions','Draft things for me','Prepare actions for review','I want automation later']
type Setup={name:string;companyName:string;businessType:string;goals:string[];projects:string;preferredTone:string;helpLevel:string}
const initial:Setup={name:'',companyName:'',businessType:'',goals:[],projects:'',preferredTone:'Friendly',helpLevel:'Just suggestions'}

function toProfile(setup:Setup):FounderProfile{
 const now=new Date().toISOString();const projects=setup.projects.split(/\n|,/).map(v=>v.trim()).filter(Boolean)
 return {id:crypto.randomUUID(),name:setup.name.trim()||'Founder',companyName:setup.companyName.trim()||'My business',businessType:setup.businessType||'Small business',
  goals:setup.goals.length?setup.goals:['Get organised'],projects:projects.length?projects:[setup.companyName.trim()||'My first project'],preferredTone:setup.preferredTone,
  helpLevel:setup.helpLevel,onboardingCompleted:true,mainProjects:projects.length?projects:[setup.companyName.trim()||'My first project'],businessStage:'validating',
  currentPriorities:setup.goals.length?setup.goals:['Get organised'],riskPreference:'balanced',defaultPermissionLevel:1,createdAt:now,updatedAt:now}
}

export function OnboardingPage({onComplete}:{onComplete:(profile:FounderProfile)=>void}){
 const [step,setStep]=useState(0);const [setup,setSetup]=useState(initial)
 const set=<K extends keyof Setup>(key:K,value:Setup[K])=>setSetup(current=>({...current,[key]:value}))
 const canContinue=step===0?Boolean(setup.name.trim()&&setup.companyName.trim()):step===1?Boolean(setup.businessType):step===2?setup.goals.length>0:true
 const finish=()=>onComplete(toProfile(setup))
 return <main className="onboarding-page"><section className="onboarding-shell phase7-onboarding"><header><span className="onboarding-logo">S</span><div><span className="eyebrow">SMALLBIZ AGENT · QUICK SETUP</span><h1>Set up your founder command center.</h1><p>Answer a few simple questions and we’ll put the most useful help first.</p></div></header>
  <div className="onboarding-progress"><span>Step {step+1} of 6</span><div>{[0,1,2,3,4,5].map(n=><i key={n} className={n<=step?'active':''}/>)}</div></div>
  <form onSubmit={event=>{event.preventDefault();step===5?finish():setStep(value=>value+1)}}>
   {step===0&&<fieldset><legend>First, what should we call you?</legend><label>Your name<input autoFocus required value={setup.name} onChange={e=>set('name',e.target.value)} placeholder="Pol"/></label><label>Business or company name<input required value={setup.companyName} onChange={e=>set('companyName',e.target.value)} placeholder="My company"/></label><small>This is used for greetings and local draft context.</small></fieldset>}
   {step===1&&<fieldset><legend>What kind of business is it?</legend><label>Business type<select autoFocus required value={setup.businessType} onChange={e=>set('businessType',e.target.value)}><option value="">Choose the closest match</option><option>Software / technology</option><option>Professional services</option><option>Retail / ecommerce</option><option>Creative / media</option><option>Health / wellbeing</option><option>Education / training</option><option>Hospitality / local service</option><option>Other small business</option></select></label><small>A broad answer is enough. You can change it later.</small></fieldset>}
   {step===2&&<fieldset><legend>What would you like help with?</legend><p className="setup-helper">Pick as many as you like. We’ll recommend workflows and teammates from these goals.</p><div className="setup-options">{goals.map(goal=><label key={goal} className={setup.goals.includes(goal)?'selected':''}><input type="checkbox" checked={setup.goals.includes(goal)} onChange={()=>set('goals',setup.goals.includes(goal)?setup.goals.filter(item=>item!==goal):[...setup.goals,goal])}/><span>{goal}</span></label>)}</div></fieldset>}
   {step===3&&<fieldset><legend>What are you working on?</legend><label>Projects or areas of focus<textarea autoFocus value={setup.projects} onChange={e=>set('projects',e.target.value)} placeholder="Website launch&#10;New service idea"/></label><small>One per line works well. You can skip this for now.</small></fieldset>}
   {step===4&&<fieldset><legend>How should SmallBiz Agent sound?</legend><div className="setup-options compact">{tones.map(tone=><label key={tone} className={setup.preferredTone===tone?'selected':''}><input type="radio" name="tone" checked={setup.preferredTone===tone} onChange={()=>set('preferredTone',tone)}/><span>{tone}</span></label>)}</div></fieldset>}
   {step===5&&<fieldset><legend>How much help would you like?</legend><div className="setup-options compact">{helpLevels.map(level=><label key={level} className={setup.helpLevel===level?'selected':''}><input type="radio" name="help" checked={setup.helpLevel===level} onChange={()=>set('helpLevel',level)}/><span>{level}</span></label>)}</div><div className="memory-notice"><b>You stay in control.</b><span>Everything is local and simulated. Nothing is sent, published, paid, or connected without a future review step.</span></div></fieldset>}
   <div className="onboarding-actions">{step>0?<button type="button" onClick={()=>setStep(value=>value-1)}>Back</button>:<button type="button" className="text-button" onClick={finish}>Skip setup</button>}<button className="primary" disabled={!canContinue} type="submit">{step===5?'Open my command center':'Next'}</button></div>
  </form><p className="onboarding-safety">Saved only in this browser · No cloud sync · Don’t enter passwords or secrets · Delete or edit anytime</p>
 </section></main>
}
