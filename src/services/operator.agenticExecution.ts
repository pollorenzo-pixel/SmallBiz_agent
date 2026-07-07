import { agents } from '../data/agents'
import type { AgentExecutionStep, AgentLearning, AgentOutput, AgenticExecutionBundle, Approval, BusinessProfile, CompanyMemoryEvent, ExecutionStatus, FounderProfile, GoalExecutionStep, GoalOrchestratorBundle, PermissionLevel, RiskLevel, WorkflowRun } from '../types'
import { isRecordArray, loadLocal, saveLocal } from './storage'

const RUNS_KEY = 'operator.agenticWorkflowRuns'
const MEMORY_KEY = 'operator.companyMemoryEvents'
const LEARNINGS_KEY = 'operator.agentLearnings'

const agentName = (id: string) => agents.find(agent => agent.id === id)?.name || id
const uniq = <T,>(items: T[]) => [...new Set(items)]

export function loadWorkflowRuns(): WorkflowRun[] {
  return loadLocal(RUNS_KEY, [], isRecordArray<WorkflowRun>)
}

export function saveWorkflowRuns(runs: WorkflowRun[]): boolean {
  return saveLocal(RUNS_KEY, runs)
}

export function loadCompanyMemoryEvents(): CompanyMemoryEvent[] {
  return loadLocal(MEMORY_KEY, [], isRecordArray<CompanyMemoryEvent>)
}

export function saveCompanyMemoryEvents(events: CompanyMemoryEvent[]): boolean {
  return saveLocal(MEMORY_KEY, events)
}

export function loadAgentLearnings(): AgentLearning[] {
  return loadLocal(LEARNINGS_KEY, [], isRecordArray<AgentLearning>)
}

export function saveAgentLearnings(learnings: AgentLearning[]): boolean {
  return saveLocal(LEARNINGS_KEY, learnings)
}

function executionStatusForStep(step: GoalExecutionStep): ExecutionStatus {
  if (step.permissionLevel === 3 || step.status === 'blocked') return 'blocked'
  if (step.permissionLevel === 2 || step.status === 'needs-approval') return 'approval_required'
  return 'completed'
}

function riskCopy(level: PermissionLevel, risk: RiskLevel) {
  if (level === 3 || risk === 'restricted') return 'This action is Level 3 and remains blocked in the MVP.'
  if (level === 2) return 'This is sensitive future work. SmallBiz Agent only created a local approval preview.'
  if (level === 1) return 'This draft was created locally. Nothing was sent, published, or changed.'
  return 'This read-only analysis ran locally using mock data.'
}

function profileContext(profile?: BusinessProfile | FounderProfile) {
  if (!profile) return 'the saved local founder profile'
  if ('businessName' in profile) return `${profile.businessName} at the ${profile.stage} stage`
  return `${profile.companyName} at the ${profile.businessStage} stage`
}

function createStepResult(step: AgentExecutionStep, goalDescription: string, profile?: BusinessProfile | FounderProfile) {
  const name = agentName(step.agentId)
  const warnings = [
    'Local simulation only: no API, email, repository, payment, accounting, or external tool was contacted.',
    riskCopy(step.permissionLevel, step.riskLevel),
  ]
  const statusLine = step.status === 'blocked'
    ? `Blocked: ${step.blockedReason || step.reason}`
    : step.status === 'approval_required'
      ? 'Prepared a review-ready preview for the Approvals screen.'
      : `Completed local mock work for ${profileContext(profile)}.`

  return {
    id: crypto.randomUUID(),
    stepId: step.id,
    agentId: step.agentId,
    status: step.status,
    summary: `${name} ${step.status === 'completed' ? 'completed' : step.status === 'approval_required' ? 'prepared approval-gated work for' : 'blocked'} “${step.title}”.`,
    output: `${statusLine}\n\nAgent output\n${name} reviewed the goal “${goalDescription}” and produced a safe MVP-ready result for this step: ${step.description}\n\nRecommended founder review\n- Check whether the recommendation matches your current priority.\n- Keep any external action as a draft until a real backend, auth, and approval system exists.\n- Do not store secrets or production credentials in this frontend MVP.`,
    confidence: step.confidence,
    createdAt: new Date().toISOString(),
    warnings,
  }
}

function createRunFromPlan(bundle: GoalOrchestratorBundle): WorkflowRun {
  const now = new Date().toISOString()
  const runId = crypto.randomUUID()
  const steps: AgentExecutionStep[] = bundle.plan.steps.map(step => {
    const status = executionStatusForStep(step)
    const startedAt = now
    const completedAt = status === 'completed' || status === 'approval_required' || status === 'blocked' ? now : undefined
    return {
      id: crypto.randomUUID(),
      runId,
      title: step.title,
      description: step.description,
      agentId: step.agentId,
      status,
      permissionLevel: step.permissionLevel,
      riskLevel: step.riskLevel,
      reason: step.reason,
      confidence: step.confidence,
      startedAt,
      completedAt,
      blockedReason: status === 'blocked' ? step.blockedReason || 'Level 3 actions are blocked in this MVP.' : undefined,
    }
  })
  return {
    id: runId,
    goalId: bundle.goal.id,
    goalTitle: bundle.goal.title,
    goalDescription: bundle.goal.description,
    workflowName: `AI company workflow: ${bundle.goal.title}`,
    leadAgentId: bundle.selectedAgents.leadAgentId,
    supportingAgentIds: bundle.selectedAgents.supportingAgentIds,
    status: 'running',
    steps,
    resultIds: [],
    approvalIds: [],
    memoryEventIds: [],
    createdAt: now,
    updatedAt: now,
    localOnlyNotice: 'Local simulated execution only. No external systems, APIs, emails, repositories, payments, or integrations were contacted.',
  }
}

function createApprovalForStep(step: AgentExecutionStep, run: WorkflowRun, reportId: string): Approval {
  return {
    id: crypto.randomUUID(),
    title: `Review: ${step.title}`,
    agentId: step.agentId,
    proposedAction: `Approve the local preview for “${run.goalTitle}”: ${step.description}`,
    reason: 'Level 2 work is sensitive. This approval only records a local review decision and does not trigger any external action.',
    confidence: step.confidence,
    riskLevel: step.riskLevel,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceOutputId: reportId,
    permissionLevel: 2,
    payloadPreview: JSON.stringify({
      mode: 'agentic-execution-preview',
      externalExecution: false,
      runId: run.id,
      stepId: step.id,
      permissionLevel: step.permissionLevel,
      safety: 'Simulated only. Approval does not send, publish, pay, deploy, update, or contact external systems.',
    }, null, 2),
  }
}

function createReport(run: WorkflowRun, results: AgentExecutionStep[], approvals: Approval[], profile?: BusinessProfile | FounderProfile, reportId = crypto.randomUUID()): AgentOutput {
  const completed = results.filter(step => step.status === 'completed')
  const approvalRequired = results.filter(step => step.status === 'approval_required')
  const blocked = results.filter(step => step.status === 'blocked')
  const lead = agentName(run.leadAgentId)
  const support = run.supportingAgentIds.map(agentName)
  const fullOutput = `Original goal\n${run.goalDescription}\n\nGenerated workflow\n${run.workflowName}\n\nLead agent\n${lead}\n\nSupporting agents\n${support.join(', ') || 'None'}\n\nExecution timeline\n${results.map((step, index) => `${index + 1}. ${agentName(step.agentId)} — ${step.title} — ${step.status} — Level ${step.permissionLevel}\n${step.result?.output || step.blockedReason || step.reason}`).join('\n\n')}\n\nApproval previews created\n${approvals.length ? approvals.map(approval => `- ${approval.title}: ${approval.reason}`).join('\n') : 'None.'}\n\nBlocked actions\n${blocked.length ? blocked.map(step => `- ${step.title}: ${step.blockedReason || step.reason}`).join('\n') : 'None.'}\n\nWhat your AI team learned\n${completed.map(step => `- ${agentName(step.agentId)} learned how this goal relates to ${profileContext(profile)}: ${step.title}.`).join('\n') || '- No completed steps were available to learn from.'}\n\nSafety note\nThis was a local mock execution foundation. Nothing was sent, published, paid, deployed, changed in GitHub, connected to Xero, or executed outside localStorage.`

  return {
    id: reportId,
    agentId: run.leadAgentId,
    title: `Execution report: ${run.goalTitle}`,
    summary: `${lead} coordinated ${completed.length} completed step(s), ${approvalRequired.length} approval preview(s), and ${blocked.length} blocked Level 3 item(s).`,
    plainEnglishSummary: `Your AI company locally simulated the workflow for “${run.goalTitle}” and saved the results for review.`,
    fullOutput,
    tags: uniq(['agentic-execution', 'workflow-run', run.leadAgentId, ...run.supportingAgentIds, blocked.length ? 'level-3-blocked' : 'local-only']),
    createdAt: new Date().toISOString(),
    usefulnessRating: null,
    approvalNeeded: approvalRequired.length > 0,
    riskNote: blocked.length ? 'Level 3 restricted actions were blocked and never executed.' : approvalRequired.length ? 'Level 2 actions created local approval previews only.' : 'Local mock execution only.',
    futureIntegrationNote: 'Future versions can connect this to Supabase/Postgres, auth, RLS, server-side execution, AI Gateway, and real integrations only behind explicit approvals.',
    source: 'agentic-execution',
    permissionLevel: blocked.length ? 3 : approvalRequired.length ? 2 : 1,
    workflowId: run.id,
    keyFindings: [
      `Lead agent: ${lead}`,
      `Supporting agents: ${support.join(', ') || 'None'}`,
      `${completed.length} local step(s) completed`,
      `${approvalRequired.length} approval preview(s) created`,
      `${blocked.length} Level 3 item(s) blocked`,
    ],
    recommendedNextSteps: [
      'Review the saved execution report.',
      approvalRequired.length ? 'Open Approvals to inspect Level 2 preview items.' : 'Use the report to choose your next business move.',
      'Keep secrets, payments, tax, legal commitments, production deletion, and real integrations outside this MVP.',
    ],
    approvalSummary: approvalRequired.length ? 'Approval previews were created locally. Approving them does not trigger external execution.' : 'No approval previews were required.',
  }
}

function createMemoryEvents(run: WorkflowRun, steps: AgentExecutionStep[], reportId: string, approvalsByStep: Map<string, Approval>): { events: CompanyMemoryEvent[]; learnings: AgentLearning[] } {
  const now = new Date().toISOString()
  const events: CompanyMemoryEvent[] = [
    {
      id: crypto.randomUUID(),
      runId: run.id,
      type: 'goal',
      title: `Goal executed locally: ${run.goalTitle}`,
      summary: `The AI team created and ran a local mock workflow for “${run.goalDescription}”.`,
      agentId: run.leadAgentId,
      relatedGoalId: run.goalId,
      relatedReportId: reportId,
      createdAt: now,
      tags: ['goal', 'agentic-execution', run.leadAgentId],
    },
  ]

  const learnings: AgentLearning[] = steps
    .filter(step => step.status === 'completed' || step.status === 'approval_required')
    .map(step => ({
      id: crypto.randomUUID(),
      runId: run.id,
      agentId: step.agentId,
      learning: `${agentName(step.agentId)} learned that “${step.title}” is useful context for future work on “${run.goalTitle}”.`,
      confidence: step.confidence,
      createdAt: now,
    }))

  steps.forEach(step => {
    const approval = approvalsByStep.get(step.id)
    if (step.status === 'approval_required') {
      events.push({
        id: crypto.randomUUID(),
        runId: run.id,
        type: 'approval',
        title: `Approval preview created: ${step.title}`,
        summary: `${agentName(step.agentId)} prepared a Level 2 preview. It is stored locally and does not execute externally.`,
        agentId: step.agentId,
        relatedGoalId: run.goalId,
        relatedReportId: reportId,
        relatedApprovalId: approval?.id,
        createdAt: now,
        tags: ['approval', 'level-2', step.agentId],
      })
    }
    if (step.status === 'blocked') {
      events.push({
        id: crypto.randomUUID(),
        runId: run.id,
        type: 'blocked_action',
        title: `Blocked restricted step: ${step.title}`,
        summary: step.blockedReason || 'Level 3 restricted work was blocked locally.',
        agentId: step.agentId,
        relatedGoalId: run.goalId,
        relatedReportId: reportId,
        createdAt: now,
        tags: ['blocked', 'level-3', step.agentId],
      })
    }
  })

  learnings.forEach(learning => {
    events.push({
      id: crypto.randomUUID(),
      runId: run.id,
      type: 'learning',
      title: `AI team learned: ${agentName(learning.agentId)}`,
      summary: learning.learning,
      agentId: learning.agentId,
      relatedGoalId: run.goalId,
      relatedReportId: reportId,
      createdAt: now,
      tags: ['learning', learning.agentId],
    })
  })

  return { events, learnings }
}

export function runLocalAgenticExecution(bundle: GoalOrchestratorBundle, profile?: BusinessProfile | FounderProfile): AgenticExecutionBundle {
  const initialRun = createRunFromPlan(bundle)
  const executedSteps = initialRun.steps.map(step => {
    const result = createStepResult(step, initialRun.goalDescription, profile)
    return { ...step, result }
  })
  const provisionalRun = { ...initialRun, steps: executedSteps }
  const reportId = crypto.randomUUID()
  const approvalPairs = executedSteps
    .filter(step => step.status === 'approval_required' && step.permissionLevel === 2)
    .map(step => ({ stepId: step.id, approval: createApprovalForStep(step, provisionalRun, reportId) }))
  const approvals = approvalPairs.map(pair => pair.approval)
  const approvalsByStep = new Map(approvalPairs.map(pair => [pair.stepId, pair.approval]))
  const finalSteps = executedSteps.map(step => ({ ...step, approvalId: approvalsByStep.get(step.id)?.id }))
  const finalReport = createReport({ ...provisionalRun, steps: finalSteps }, finalSteps, approvals, profile, reportId)
  const { events, learnings } = createMemoryEvents(provisionalRun, finalSteps, finalReport.id, approvalsByStep)
  const hasBlocked = finalSteps.some(step => step.status === 'blocked')
  const needsApproval = finalSteps.some(step => step.status === 'approval_required')
  const finalStatus: ExecutionStatus = hasBlocked ? 'blocked' : needsApproval ? 'approval_required' : 'completed'
  const now = new Date().toISOString()
  const run: WorkflowRun = {
    ...provisionalRun,
    status: finalStatus,
    steps: finalSteps,
    resultIds: finalSteps.map(step => step.result?.id).filter(Boolean) as string[],
    reportId: finalReport.id,
    approvalIds: approvals.map(approval => approval.id),
    memoryEventIds: events.map(event => event.id),
    updatedAt: now,
    completedAt: now,
    blockedReason: hasBlocked ? 'One or more Level 3 restricted steps were blocked. No external action was executed.' : undefined,
  }

  saveWorkflowRuns([run, ...loadWorkflowRuns()])
  saveCompanyMemoryEvents([...events, ...loadCompanyMemoryEvents()])
  saveAgentLearnings([...learnings, ...loadAgentLearnings()])

  return { run, report: finalReport, approvals, memoryEvents: events, learnings }
}
