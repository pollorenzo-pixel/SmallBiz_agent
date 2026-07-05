import type { FounderProfile, StepStatus, Workflow, WorkflowResult } from '../types'
import { agents } from '../data/agents'
import { Badge } from '../components/Badge'
import { getWorkflowTools } from '../services/tools/toolRegistry'
import { recommendWorkflows } from '../services/workflowRecommendations'

const statusLabels: Record<StepStatus,string> = {'not-started':'Not started',running:'Running',completed:'Completed','needs-approval':'Needs approval',blocked:'Blocked'}
function stepStatus(workflow: Workflow, index: number, running: string|null): StepStatus {
  if (workflow.riskLevel === 'restricted') return index === workflow.steps.length-1 ? 'blocked' : 'not-started'
  if (running === workflow.id) return index === 0 ? 'running' : 'not-started'
  if (workflow.status === 'complete') return workflow.requiresApproval && index === workflow.steps.length-1 ? 'needs-approval' : 'completed'
  return 'not-started'
}

interface Props {
  founderProfile:FounderProfile; workflows: Workflow[]; running: string|null; run:(id:string)=>void; result:WorkflowResult|null; error:string
  viewReport:()=>void; viewApproval:()=>void
}
export function WorkflowsPage({ founderProfile,workflows, running, run, result, error, viewReport, viewApproval }:Props) {
 const resultAgent=result?agents.find(a=>a.id===result.agentId):null;const recommended=recommendWorkflows(workflows,founderProfile,3)
 return <div className="page"><header className="topbar friendly-topbar"><div><p className="eyebrow">THINGS I CAN HELP WITH</p><h1>Help Menu</h1><p>Pick a task and your AI team will prepare the work for you.</p></div></header>
  {result&&<section className="result-state friendly-result"><div className="result-check">✓</div><div className="result-copy"><span className="eyebrow">READY</span><h2>What I prepared</h2><p>{result.reportSummary}</p><div className="result-meta"><Badge>{resultAgent?.name}</Badge>{result.approvalId&&<Badge tone="warning">Needs your review first</Badge>}</div><p><b>Saved to:</b> Saved Work</p><details className="advanced-details"><summary>How this was prepared</summary><div className="execution-summary"><b>AI mode</b><span>Local demo mode</span><b>Abilities used</b><span>{result.simulatedTools?.join(' · ')||'Local preparation tools'}</span><b>Safety check</b><span>{result.permissionDecision}</span><b>Reference</b><span>{result.executionResultId}</span></div></details></div><div className="result-actions"><button className="primary" onClick={viewReport}>Open saved work</button>{result.approvalId&&<button onClick={viewApproval}>Review it</button>}</div></section>}
  {error&&<div className="run-error"><b>Simulation stopped safely</b><span>{error}</span></div>}
  <section className="recommended-strip"><div><span className="eyebrow">RECOMMENDED FIRST</span><h2>Good next steps for your goals</h2></div><div>{recommended.map(item=><button key={item.id} disabled={running!==null} onClick={()=>run(item.id)}><b>{item.name}</b><small>Start local draft</small></button>)}</div></section>
  <div className="workflow-grid friendly-workflow-grid">{workflows.map(w=>{const a=agents.find(x=>x.id===w.assignedAgent)!;const tools=getWorkflowTools(w.id);return <article className="workflow-card" key={w.id}><div className="workflow-head"><span className="workflow-symbol">{w.id==='invoice'?'▣':w.id==='marketing'?'✎':'↗'}</span><div><h2>{w.name}</h2><p>{w.description}</p></div></div><div className="meta-row"><Badge>{w.steps.length<=4?'Quick draft':'Detailed review'}</Badge>{w.requiresApproval&&<Badge tone="warning">Needs your review first</Badge>}<Badge tone={w.riskLevel}>Risk: {w.riskLevel}</Badge></div><p className="best-for"><b>Best for:</b> {w.steps.slice(0,2).join(' and ').toLowerCase()}</p><div className="assigned"><span>{a.name.slice(0,1)}</span><div><small>PREPARED BY</small><b>{a.name}</b></div></div><details className="advanced-details"><summary>Advanced details</summary><div className="workflow-tools"><b>Available abilities</b><div>{tools.map(tool=><span key={tool.id}>{tool.id} · Safety {tool.permissionLevel}</span>)}</div></div><ol className="steps">{w.steps.map((s,i)=>{const status=stepStatus(w,i,running);return <li className={`step-${status}`} key={s}><span>{status==='completed'?'✓':status==='running'?'…':status==='needs-approval'?'!':status==='blocked'?'×':i+1}</span><b>{s}</b><em>{statusLabels[status]}</em></li>})}</ol></details><div className="workflow-footer"><small>{w.lastRunAt?`Last prepared ${new Date(w.lastRunAt).toLocaleDateString()}`:'Ready when you are'}</small><button disabled={running!==null||w.riskLevel==='restricted'} onClick={()=>run(w.id)}>{running===w.id?'Preparing…':w.riskLevel==='restricted'?'Unavailable':'Start'}</button></div></article>})}</div><div className="restricted-callout"><Badge tone="restricted">SAFETY FIRST</Badge><div><b>Some actions are always unavailable</b><p>Payments, tax submissions, deletion, and irreversible changes cannot happen in this demo.</p></div></div></div>
}
