import type { Approval, Workflow } from '../types'
import { appMode } from '../config/appMode'

export function shouldCreateApproval(workflow: Workflow): boolean {
  if (workflow.riskLevel === 'low' || workflow.riskLevel === 'restricted') return false
  return workflow.riskLevel === 'high' || (workflow.riskLevel === 'medium' && workflow.requiresApproval)
}

export function createApproval(workflow: Workflow): Approval | null {
 if (!shouldCreateApproval(workflow)) return null
 if(!appMode.allowsDemoData&&workflow.id==='gmail-review')return {
    id:crypto.randomUUID(), title:'Gmail backend connection review', agentId:'founder',
    proposedAction:'Review the Gmail integration boundary before any future backend OAuth connection. No inbox was read and no email draft was generated.',
    reason:'Gmail is backend-ready only. Reading inbox data or sending email would require backend OAuth, server-side secrets, scoped permission review, audit logs, and explicit approval gates.',
    confidence:90, riskLevel:'medium', status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'gmail-integration-boundary-preview',workflowId:workflow.id,externalExecution:false,gmailOAuthConnected:false,inboxRead:false,sendEmail:false,level3Blocked:['payments','tax submissions','bank reconciliation','legal commitments']},null,2)
  }
 if(!appMode.allowsDemoData&&workflow.id==='calendar-review')return {
    id:crypto.randomUUID(), title:'Calendar backend connection review', agentId:'founder',
    proposedAction:'Review the Google Calendar integration boundary before any future backend OAuth connection. No calendar was read and no event action was generated.',
    reason:'Google Calendar is backend-ready only. Reading or changing events would require backend OAuth, server-side secrets, scoped permission review, audit logs, and explicit approval gates.',
    confidence:90, riskLevel:'medium', status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'calendar-integration-boundary-preview',workflowId:workflow.id,externalExecution:false,googleCalendarOAuthConnected:false,calendarRead:false,createEvent:false,updateEvent:false,deleteEvent:false,sendFollowUp:false,level3Blocked:['payments','tax submissions','bank reconciliation','legal commitments','irreversible deletes','unapproved cancellations']},null,2)
  }
 if(!appMode.allowsDemoData&&workflow.id==='founder-connections')return {
    id:crypto.randomUUID(), title:'Community integration boundary review', agentId:'community',
    proposedAction:'Review the founder community boundary before any future opt-in network connection. No fictional profiles were loaded and no outreach draft was addressed to a real person.',
    reason:'Real outreach affects another person. Future community suggestions must be opt-in, consent-based, backend-controlled, rate-limited, and approval-gated. Scraping, contact lookup, mass outreach, and automatic sending remain blocked.',
    confidence:88, riskLevel:'medium', status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'community-integration-boundary-preview',workflowId:workflow.id,externalExecution:false,optInNetworkConnected:false,profilesLoaded:false,outreachSent:false,blocked:['scraping','contact lookup','mass outreach','automatic sending']},null,2)
  }
  if(workflow.id==='gmail-review')return {
    id:crypto.randomUUID(), title:'Finance/Admin review · Gmail send draft', agentId:'finance',
    proposedAction:'Review the prepared Gmail draft replies, including the invoice reminder response. Approving only records a local send-email approval preview; it cannot send email, pay, reconcile, or confirm financial status.',
    reason:'Sending an email is Level 2 and requires explicit founder approval. Payment, bank reconciliation, tax submission, and final accounting decisions remain Level 3 blocked. No real Gmail OAuth, Gmail API, or delivery service is connected.',
    confidence:86, riskLevel:'medium', status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'gmail-send-email-preview',workflowId:workflow.id,externalExecution:false,gmailOAuthConnected:false,sendEmail:false,level3Blocked:['payments','tax submissions','bank reconciliation','legal commitments']},null,2)
  }
  if(workflow.id==='calendar-review')return {
    id:crypto.randomUUID(), title:'Calendar action preview · Meeting follow-up', agentId:'founder',
    proposedAction:'Review prepared calendar follow-up actions. Approving only records a local calendar approval preview; it cannot create, update, delete, cancel, invite, or send anything in this MVP.',
    reason:'Creating/updating calendar events, inviting attendees, or sending meeting follow-ups is Level 2 and requires explicit founder approval. Finance, legal, payment, tax, reconciliation, cancellation, deletion, and irreversible commitments remain Level 3 blocked. No real Google Calendar OAuth or API is connected.',
    confidence:84, riskLevel:'medium', status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'calendar-action-preview',workflowId:workflow.id,externalExecution:false,googleCalendarOAuthConnected:false,createEvent:false,updateEvent:false,inviteAttendee:false,sendFollowUp:false,level3Blocked:['payments','tax submissions','bank reconciliation','legal commitments','irreversible deletes','unapproved cancellations']},null,2)
  }
  return {
    id:crypto.randomUUID(), title:`Local preview: ${workflow.name}`, agentId:workflow.assignedAgent,
    proposedAction:`Review the mock ${workflow.name.toLowerCase()} draft. Approving only records a local decision; it cannot execute an external action.`,
    reason:`${workflow.riskLevel === 'high' ? 'High-risk' : 'Draft external'} work requires explicit human review. No external service has been contacted. A future integration may use this decision before acting.`,
    confidence:workflow.riskLevel === 'high' ? 72 : 88, riskLevel:workflow.riskLevel, status:'pending', createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),permissionLevel:2,
    payloadPreview:JSON.stringify({mode:'local-preview',workflowId:workflow.id,agentId:workflow.assignedAgent,proposedAction:workflow.name,externalExecution:false},null,2)
  }
}
