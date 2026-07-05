import { useState } from 'react'
import type { BuilderRunBundle, ProjectWorkspaceProject } from '../types'
import { builderWorkflows } from '../services/operator.builderWorkflows'
import { Badge } from './Badge'

export function GuidedBuilder({project,run,openReports,openApprovals}:{project:ProjectWorkspaceProject;run:(workflowId:string,inputs:Record<string,string>)=>BuilderRunBundle;openReports:()=>void;openApprovals:()=>void}){
 const [selectedId,setSelectedId]=useState(builderWorkflows[0].id);const [inputs,setInputs]=useState<Record<string,string>>({});const [result,setResult]=useState<BuilderRunBundle|null>(null)
 const selected=builderWorkflows.find(item=>item.id===selectedId)||builderWorkflows[0]
 const choose=(id:string)=>{setSelectedId(id);setInputs({});setResult(null)}
 const build=()=>setResult(run(selected.id,inputs))
 return <section className="guided-builder"><div className="builder-intro"><div><span className="eyebrow">BUILD SOMETHING</span><h3>What do you want your AI team to prepare?</h3><p>Choose a useful business asset for <b>{project.name}</b>. You’ll get a plan, actions, and milestones—never an automatic launch.</p></div><Badge tone="live">Planning only</Badge></div>
  <div className="builder-card-grid">{builderWorkflows.map(item=><button className={item.id===selected.id?'selected':''} key={item.id} onClick={()=>choose(item.id)}><span>{item.category==='website'?'◎':item.category==='ads'?'◉':item.category==='app'?'⌁':item.category==='automation'?'↗':'✦'}</span><b>{item.name}</b><small>{item.description}</small></button>)}</div>
  <div className="builder-form"><div><Badge>{selected.bestFor}</Badge><h3>{selected.name}</h3><p>{selected.mockOnlyNotice}</p></div><div className="builder-inputs">{selected.inputPrompts.map(item=><label key={item.id}>{item.label}<input value={inputs[item.id]||''} onChange={event=>setInputs(current=>({...current,[item.id]:event.target.value}))} placeholder={item.placeholder}/><small>{item.helper}</small></label>)}</div><button className="primary" onClick={build}>Build this plan</button></div>
  {result&&<div className="builder-result"><span className="result-check">✓</span><div><span className="eyebrow">PLAN SAVED</span><h3>{result.output.title}</h3><p>{result.output.summary}</p><div className="builder-result-counts"><span>{result.actions.length} actions added</span><span>{result.milestones.length} milestones added</span><span>{result.approvals.length?`${result.approvals.length} mock approval preview`:'No approval needed'}</span></div><small>No real action was taken. Everything remains local to this browser.</small></div><div><button onClick={openReports}>Open report</button>{result.approvals.length>0&&<button onClick={openApprovals}>Review approval preview</button>}</div></div>}
 </section>
}
