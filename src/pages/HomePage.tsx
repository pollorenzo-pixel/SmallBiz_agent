import { useState } from 'react'
import type { Approval, AgentOutput, BusinessProfile, FounderProfile, MockAgentResult, Workflow } from '../types'
import { agents } from '../data/agents'
import { Badge } from '../components/Badge'
import { recommendWorkflows } from '../services/workflowRecommendations'

const quick = [
  {label:'Plan my day',workflow:'daily',prompt:'Help me plan my day.'},
  {label:'Review feedback',workflow:'vexis',prompt:'Turn customer feedback into clear next steps.'},
  {label:'Write a post',workflow:'marketing',prompt:'Write a social post for my business.'},
  {label:'Prepare a coding task',workflow:'github',prompt:'Prepare a coding task.'},
  {label:'Review invoices',workflow:'invoice',prompt:'Review my invoices and flag anything unclear.'},
  {label:'Research something',workflow:'research',prompt:'Research an important question for my business.'}
]
const quickGoals:Record<string,string[]>={'Get organised':['daily'],'Find customers':['marketing','research'],'Improve product/service':['vexis','research'],'Create content/marketing':['marketing'],'Handle admin/finance':['invoice','daily'],'Research ideas/tools':['research'],'Build software/features':['github','vexis']}

interface Props { profile:BusinessProfile;founderProfile:FounderProfile;workflows:Workflow[];reports:AgentOutput[];approvals:Approval[];run:(id:string)=>void;go:(page:'workflows'|'approvals'|'reports'|'agents')=>void;submitPrompt:(prompt:string)=>MockAgentResult;promptResult:MockAgentResult|null }
export function HomePage({ profile, founderProfile, workflows, reports, approvals, run, go, submitPrompt, promptResult }:Props) {
 const [prompt,setPrompt]=useState(''); const pending=approvals.filter(a=>a.status==='pending'); const recommended=recommendWorkflows(workflows,founderProfile)
 const preferredIds=new Set(founderProfile.goals.flatMap(goal=>quickGoals[goal]||[]));const orderedQuick=[...quick].sort((a,b)=>Number(preferredIds.has(b.workflow))-Number(preferredIds.has(a.workflow)))
 const hour=new Date().getHours();const greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening'
 const submit=(value=prompt)=>{if(!value.trim())return;submitPrompt(value);setPrompt('')}
 const useQuick=(item:typeof quick[number])=>workflows.some(w=>w.id===item.workflow)?run(item.workflow):submitPrompt(item.prompt)
 return <div className="page home-page simple-home">
  <header className="welcome"><p>{new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</p><h1>{greeting}, {founderProfile.name}. What can we help with?</h1><span>{profile.businessName} · {founderProfile.businessType}</span></header>
  <form className="help-command" onSubmit={e=>{e.preventDefault();submit()}}><label htmlFor="main-help">What do you need help with today?</label><div><input id="main-help" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. Help me decide what to focus on next"/><button type="submit">Ask my AI team</button></div><small>Prepared in local demo mode. Nothing is sent or published.</small></form>
  {promptResult&&<section className={`friendly-result ${promptResult.blockedReason?'blocked-result':''}`}><span>{promptResult.blockedReason?'×':'✓'}</span><div><h2>{promptResult.output?.title||'This request was stopped safely'}</h2><p>{promptResult.blockedReason||promptResult.output?.summary}</p><small>{promptResult.approvalDraft?'This needs your review first.':'Saved locally for you.'}</small></div>{promptResult.output&&<button onClick={()=>go('reports')}>Open saved work</button>}</section>}
  <section><div className="simple-section-title"><h2>Recommended for you</h2><button onClick={()=>go('workflows')}>See everything</button></div><div className="simple-quick-grid">{orderedQuick.map((item,i)=><button key={item.label} onClick={()=>useQuick(item)}>{preferredIds.has(item.workflow)&&<em>For your goals</em>}<span>{['☀','♡','✎','⌁','▣','⌕'][i]}</span><b>{item.label}</b></button>)}</div></section>
  <div className="simple-dashboard">
   <section className="calm-panel"><div className="simple-section-title"><h2>Needs review</h2><button onClick={()=>go('approvals')}>See all</button></div>{pending.length?pending.slice(0,2).map(a=><button className="simple-list-item" key={a.id} onClick={()=>go('approvals')}><span>!</span><div><b>{a.title}</b><small>{a.reason}</small></div></button>):<p className="friendly-empty">You’re all caught up. Important actions will wait here for you.</p>}</section>
   <section className="calm-panel"><div className="simple-section-title"><h2>Recent saved work</h2><button onClick={()=>go('reports')}>See all</button></div>{reports.length?reports.slice(0,3).map(r=><button className="simple-list-item" key={r.id} onClick={()=>go('reports')}><span>✓</span><div><b>{r.title}</b><small>{agents.find(a=>a.id===r.agentId)?.name} · {new Date(r.createdAt).toLocaleDateString()}</small></div></button>):<p className="friendly-empty">Nothing saved yet. Pick an option above to create your first piece of work.</p>}</section>
  </div>
  <section className="calm-panel priorities-panel"><div className="simple-section-title"><h2>Current focus</h2><Badge tone="live">For {profile.businessName}</Badge></div>{founderProfile.goals.map((p,i)=><div className="priority" key={p}><span>{i+1}</span><div><b>{p}</b><small>{i===0?`Suggested next: ${recommended[0]?.name||'Plan my day'}`:(founderProfile.projects[0]||profile.biggestChallenge)}</small></div></div>)}</section>
 </div>
}
