import type { StepStatus, Workflow, WorkflowResult } from '../types'
import { agents } from '../data/agents'
import { Badge } from '../components/Badge'

const statusLabels: Record<StepStatus,string> = {'not-started':'Not started',running:'Running',completed:'Completed','needs-approval':'Needs approval',blocked:'Blocked'}
function stepStatus(workflow: Workflow, index: number, running: string|null): StepStatus {
  if (workflow.riskLevel === 'restricted') return index === workflow.steps.length-1 ? 'blocked' : 'not-started'
  if (running === workflow.id) return index === 0 ? 'running' : 'not-started'
  if (workflow.status === 'complete') return workflow.requiresApproval && index === workflow.steps.length-1 ? 'needs-approval' : 'completed'
  return 'not-started'
}

interface Props {
  workflows: Workflow[]; running: string|null; run:(id:string)=>void; result:WorkflowResult|null; error:string
  viewReport:()=>void; viewApproval:()=>void
}
export function WorkflowsPage({ workflows, running, run, result, error, viewReport, viewApproval }:Props) {
 const resultAgent=result?agents.find(a=>a.id===result.agentId):null
 return <div className="page"><header className="topbar"><div><p className="eyebrow">REPEATABLE OPERATIONS</p><h1>Workflows</h1><p>Structured mock runs with approval gates where risk demands it.</p></div></header>
  {result&&<section className="result-state"><div className="result-check">✓</div><div className="result-copy"><span className="eyebrow">LOCAL SIMULATION COMPLETE</span><h2>{result.workflowName}</h2><p>{result.reportSummary}</p><div className="result-meta"><Badge tone={result.riskLevel}>{result.riskLevel} risk</Badge><Badge>{resultAgent?.name}</Badge>{result.approvalId&&<Badge tone="warning">Local approval created</Badge>}</div><small>Mock report generated. No external action was taken.</small></div><div className="result-actions"><button className="primary" onClick={viewReport}>View generated report →</button>{result.approvalId&&<button onClick={viewApproval}>View approval</button>}</div></section>}
  {error&&<div className="run-error"><b>Simulation stopped safely</b><span>{error}</span></div>}
  <div className="workflow-grid">{workflows.map(w=>{const a=agents.find(x=>x.id===w.assignedAgent)!;return <article className="workflow-card" key={w.id}><div className="workflow-head"><span className="workflow-symbol">{w.id==='invoice'?'▣':w.id==='marketing'?'✎':'↗'}</span><div><h2>{w.name}</h2><p>{w.description}</p></div></div><div className="meta-row"><Badge tone={w.riskLevel}>{w.riskLevel} risk</Badge>{w.requiresApproval&&<Badge tone="warning">Approval required</Badge>}<Badge>{w.status}</Badge></div><div className="assigned"><span>{a.name.slice(0,1)}</span><div><small>ASSIGNED AGENT</small><b>{a.name}</b></div></div><ol className="steps">{w.steps.map((s,i)=>{const status=stepStatus(w,i,running);return <li className={`step-${status}`} key={s}><span>{status==='completed'?'✓':status==='running'?'…':status==='needs-approval'?'!':status==='blocked'?'×':i+1}</span><b>{s}</b><em>{statusLabels[status]}</em></li>})}</ol><div className="workflow-footer"><small>{w.lastRunAt?`Last run ${new Date(w.lastRunAt).toLocaleString()}`:'Not run yet'}</small><button disabled={running!==null||w.riskLevel==='restricted'} onClick={()=>run(w.id)}>{running===w.id?'Running locally…':w.riskLevel==='restricted'?'Blocked':'Run workflow →'}</button></div></article>})}</div><div className="restricted-callout"><Badge tone="restricted">L3 BLOCKED</Badge><div><b>Restricted actions stay restricted</b><p>Payments, bank reconciliation, tax submissions, production deletion, and irreversible commitments cannot run or create executable approvals in this MVP.</p></div></div></div>
}
