import type { Approval, Workflow } from '../types'

export function shouldCreateApproval(workflow: Workflow): boolean {
  if (workflow.riskLevel === 'low' || workflow.riskLevel === 'restricted') return false
  return workflow.riskLevel === 'high' || (workflow.riskLevel === 'medium' && workflow.requiresApproval)
}

export function createApproval(workflow: Workflow): Approval | null {
  if (!shouldCreateApproval(workflow)) return null
  if(workflow.id==='gmail-review')return {
    id:crypto.randomUUID(), title:'Finance/Admin review · Gmail send draft', agentId:'finance',
    proposedAction:'Review the prepared Gmail draft replies, including the invoice reminder response. Approving only records a local send-email approval preview; it cannot send email, pay, reconcile, or confirm financial status.',
    reason:'Sending an email is Level 2 and requires explicit founder approval. Payment, bank reconciliation, tax submission, and final accounting decisions remain Level 3 blocked. No real Gmail OAuth, Gmail API, or delivery service is connected.',
    confidence:86, riskLevel:'medium', status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'gmail-send-email-preview',workflowId:workflow.id,externalExecution:false,gmailOAuthConnected:false,sendEmail:false,level3Blocked:['payments','tax submissions','bank reconciliation','legal commitments']},null,2)
  }
  return {
    id:crypto.randomUUID(), title:`Local preview: ${workflow.name}`, agentId:workflow.assignedAgent,
    proposedAction:`Review the mock ${workflow.name.toLowerCase()} draft. Approving only records a local decision; it cannot execute an external action.`,
    reason:`${workflow.riskLevel === 'high' ? 'High-risk' : 'Draft external'} work requires explicit human review. No external service has been contacted. A future integration may use this decision before acting.`,
    confidence:workflow.riskLevel === 'high' ? 72 : 88, riskLevel:workflow.riskLevel, status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'local-preview',workflowId:workflow.id,agentId:workflow.assignedAgent,proposedAction:workflow.name,externalExecution:false},null,2)
  }
}
