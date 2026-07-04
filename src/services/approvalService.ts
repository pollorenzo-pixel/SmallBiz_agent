import type { Approval, Workflow } from '../types'

export function shouldCreateApproval(workflow: Workflow): boolean {
  if (workflow.riskLevel === 'low' || workflow.riskLevel === 'restricted') return false
  return workflow.riskLevel === 'high' || (workflow.riskLevel === 'medium' && workflow.requiresApproval)
}

export function createApproval(workflow: Workflow): Approval | null {
  if (!shouldCreateApproval(workflow)) return null
  return {
    id:crypto.randomUUID(), title:`Local preview: ${workflow.name}`, agentId:workflow.assignedAgent,
    proposedAction:`Review the mock ${workflow.name.toLowerCase()} draft. Approving only records a local decision; it cannot execute an external action.`,
    reason:`${workflow.riskLevel === 'high' ? 'High-risk' : 'Draft external'} work requires explicit human review. No external service has been contacted. A future integration may use this decision before acting.`,
    confidence:workflow.riskLevel === 'high' ? 72 : 88, riskLevel:workflow.riskLevel, status:'pending', createdAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'local-preview',workflowId:workflow.id,agentId:workflow.assignedAgent,proposedAction:workflow.name,externalExecution:false},null,2)
  }
}
