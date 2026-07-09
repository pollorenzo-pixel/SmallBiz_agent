import type { AgenticExecutionBundle } from '../types'
import { agents } from '../data/agents'
import { Badge } from './Badge'

const agentName = (id: string) => agents.find(agent => agent.id === id)?.name || id

export function AgenticExecutionPanel({ bundle, openReports, openApprovals }: { bundle: AgenticExecutionBundle | null; openReports: () => void; openApprovals: () => void }) {
  if (!bundle) {
    return <section className="agentic-execution-panel empty">
      <div>
        <span className="eyebrow">LOCAL AGENTIC EXECUTION</span>
        <h3>Next: let your AI company run the plan locally</h3>
        <p>After the orchestrator creates a plan, you can run a safe mock execution. Agents will produce local outputs, approval previews, blocked-action notices, and memory events.</p>
      </div>
      <Badge tone="live">Mock only</Badge>
    </section>
  }

  const { run, approvals, memoryEvents, learnings, report } = bundle
  const blocked = run.steps.filter(step => step.status === 'blocked')
  const approvalSteps = run.steps.filter(step => step.status === 'approval_required')

  return <section className="agentic-execution-panel">
    <div className="agentic-head">
      <div>
        <span className="eyebrow">PHASE 20 · LOCAL AGENTIC EXECUTION</span>
        <h3>{run.workflowName}</h3>
        <p>{run.localOnlyNotice}</p>
      </div>
      <Badge tone={blocked.length ? 'restricted' : approvalSteps.length ? 'pending' : 'live'}>{run.status.replace('_', ' ')}</Badge>
    </div>

    <div className="agentic-context">
      <section>
        <small>Original goal</small>
        <b>{run.goalDescription}</b>
      </section>
      <section>
        <small>Lead agent</small>
        <b>{agentName(run.leadAgentId)}</b>
      </section>
      <section>
        <small>Supporting agents</small>
        <b>{run.supportingAgentIds.map(agentName).join(', ') || 'None'}</b>
      </section>
    </div>

    <div className="agentic-timeline">
      <h4>Execution timeline</h4>
      {run.steps.map((step, index) => <article key={step.id} className={`agentic-step status-${step.status}`}>
        <span>{index + 1}</span>
        <div>
          <div className="agentic-step-title">
            <b>{step.title}</b>
            <Badge tone={step.permissionLevel === 3 ? 'restricted' : step.permissionLevel === 2 ? 'pending' : 'neutral'}>Level {step.permissionLevel}</Badge>
          </div>
          <p>{step.result?.summary || step.blockedReason || step.reason}</p>
          <small>{agentName(step.agentId)} · {step.status.replace('_', ' ')} · {step.riskLevel} risk · {step.confidence}% confidence</small>
          {step.result && <details>
            <summary>View local output</summary>
            <pre>{step.result.output}</pre>
          </details>}
        </div>
      </article>)}
    </div>

    <div className="agentic-summary-grid">
      <section>
        <h4>Approvals created</h4>
        <p>{approvals.length ? `${approvals.length} Level 2 local approval preview(s) were added. Nothing external happens if you approve them in this MVP.` : 'No sensitive approval previews were needed.'}</p>
        {approvals.length > 0 && <button onClick={openApprovals}>Review approvals</button>}
      </section>
      <section>
        <h4>Blocked actions</h4>
        <p>{blocked.length ? blocked.map(step => step.blockedReason || step.reason).join(' ') : 'No Level 3 restricted actions were detected.'}</p>
      </section>
      <section>
        <h4>Saved report</h4>
        <p>{report.summary}</p>
        <button onClick={openReports}>Open report</button>
      </section>
      <section>
        <h4>Local memory notes</h4>
        <ul>{learnings.slice(0, 4).map(learning => <li key={learning.id}>{learning.learning}</li>)}</ul>
      </section>
    </div>

    <div className="agentic-memory">
      <h4>Memory events saved locally</h4>
      {memoryEvents.slice(0, 5).map(event => <div key={event.id}>
        <span>{event.type.replace('_', ' ')}</span>
        <p><b>{event.title}</b> {event.summary}</p>
      </div>)}
      <small>Memory is localStorage-only in this MVP. There is no cloud sync, no secrets, and no backend execution.</small>
    </div>
  </section>
}
