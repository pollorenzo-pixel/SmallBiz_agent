import { useState } from 'react'
import type { AgenticExecutionBundle, GoalOrchestratorBundle, ProjectWorkspaceProject } from '../types'
import { agents } from '../data/agents'
import { Badge } from './Badge'
import { AgenticExecutionPanel } from './AgenticExecutionPanel'

const examples=['Launch my business in 30 days','Build a landing page feature','Improve customer acquisition','Review invoices and cash flow','Research competitors','Delete production database']

export function GoalOrchestratorPanel({projects,runGoal,runAgenticExecution,openReports,openApprovals}:{projects:ProjectWorkspaceProject[];runGoal:(input:string,projectId?:string)=>GoalOrchestratorBundle|null;runAgenticExecution:(bundle:GoalOrchestratorBundle)=>AgenticExecutionBundle;openReports:()=>void;openApprovals:()=>void}){
 const [input,setInput]=useState(''); const [projectId,setProjectId]=useState(projects[0]?.id||''); const [bundle,setBundle]=useState<GoalOrchestratorBundle|null>(null); const [execution,setExecution]=useState<AgenticExecutionBundle|null>(null)
 const build=()=>{const result=runGoal(input,projectId||undefined); if(result){setBundle(result);setExecution(null)}}
 const execute=()=>{if(bundle)setExecution(runAgenticExecution(bundle))}
 const lead=agents.find(agent=>agent.id===bundle?.selectedAgents.leadAgentId); const supports=bundle?.selectedAgents.supportingAgentIds.map(id=>agents.find(agent=>agent.id===id)?.name||id)||[]
 const blocked=bundle?.executionResult.blockedSteps||[]
 return <section className="goal-orchestrator calm-panel"><div className="goal-orchestrator-head"><div><span className="eyebrow">PHASE 19 · GOAL ORCHESTRATOR</span><h2>What business goal do you want the AI team to plan?</h2><p>Give one goal. The local orchestrator chooses a lead agent, supporting agents, safe steps, approvals, and a saved report.</p></div><Badge tone="live">Local mock</Badge></div>
  <label className="goal-input">Your goal<textarea value={input} onChange={event=>setInput(event.target.value)} placeholder="e.g. Launch my bookkeeping service and prepare customer outreach"/></label>
  {projects.length>0&&<label className="goal-project">Link to project<select value={projectId} onChange={event=>setProjectId(event.target.value)}><option value="">No project link</option>{projects.map(project=><option key={project.id} value={project.id}>{project.name}</option>)}</select></label>}
  <div className="command-examples">{examples.map(example=><button key={example} type="button" onClick={()=>setInput(example)}>{example}</button>)}</div>
  <button className="primary" disabled={!input.trim()} onClick={build}>Build goal plan</button>
  {bundle&&<article className="goal-result"><div className="goal-result-head"><div><Badge tone={blocked.length?'restricted':'live'}>{blocked.length?'Level 3 blocked':'Plan saved'}</Badge><h3>{bundle.goal.title}</h3><p>{bundle.analysis.summary}</p></div><button onClick={openReports}>Open report</button></div>
   <div className="goal-agent-grid"><section><small>Lead agent</small><b>{lead?.name||bundle.selectedAgents.leadAgentId}</b></section><section><small>Supporting agents</small><b>{supports.join(', ')||'None'}</b></section></div>
   <div className="goal-plan-list"><h4>Execution plan</h4>{bundle.executionResult.steps.map(step=><div key={step.id} className={`goal-step level-${step.permissionLevel}`}><span>Level {step.permissionLevel}</span><div><b>{step.title}</b><p>{step.outputSummary||step.blockedReason||step.reason}</p><small>{agents.find(agent=>agent.id===step.agentId)?.name||step.agentId} · {step.status} · {step.riskLevel} risk · {step.confidence}% confidence</small></div></div>)}</div>
   <div className="goal-summary-grid"><section><h4>Permission summary</h4><p>{bundle.plan.permissionSummary}</p></section><section><h4>Risk summary</h4><p>{bundle.plan.riskSummary}</p></section><section><h4>Approvals created</h4><p>{bundle.approvals.length?`${bundle.approvals.length} local preview item(s) created.`:'No approval previews needed.'}</p>{bundle.approvals.length>0&&<button onClick={openApprovals}>Review approvals</button>}</section><section><h4>Blocked Level 3 items</h4><p>{blocked.length?blocked.map(step=>step.blockedReason).join(' '):'None detected.'}</p></section></div>
   <div className="goal-execute-card"><div><b>Ready to let the AI team run this locally?</b><p>The agents will simulate each step, save a final report, create approval previews for Level 2 work, block Level 3 work, and store local memory events.</p></div><button className="primary" onClick={execute}>Run local agentic execution</button></div>
   <p className="goal-report-link"><b>Saved report:</b> {bundle.report.title}</p>
  </article>}
  <AgenticExecutionPanel bundle={execution} openReports={openReports} openApprovals={openApprovals}/>
 </section>
}
