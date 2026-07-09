import type { AgentOutput, BusinessProfile, FounderProfile, GmailActionPlan, GmailDraftReply, GmailIntegrationStatus, GmailMessage, GmailMessageCategory, GmailPriority, GmailReviewResult, GmailSummary, GmailThread, PermissionLevel, RiskLevel } from '../types'
import { appMode, demoDataUnavailableSummary } from '../config/appMode'

export const gmailIntegrationStatus:GmailIntegrationStatus='mock-connected'

export const mockGmailMessages:GmailMessage[]=[
 {id:'gmail-msg-invoice',threadId:'gmail-thread-invoice',from:'accounts@northstar-supplies.example',to:'founder@example.com',subject:'Invoice INV-2048 payment reminder',snippet:'Just checking whether invoice INV-2048 is scheduled for payment this week.',body:'Hi, just checking whether invoice INV-2048 is scheduled for payment this week. Could you confirm the expected payment date? Thanks, Northstar Supplies.',receivedAt:'2026-07-09T08:12:00.000Z',unread:true,category:'finance',priority:'urgent',riskLevel:'high'},
 {id:'gmail-msg-meeting',threadId:'gmail-thread-meeting',from:'maya@brightpath.example',to:'founder@example.com',subject:'Can we book a quick onboarding call?',snippet:'Do you have time Tuesday or Thursday to talk through onboarding?',body:'Hi, we are nearly ready to start. Do you have time Tuesday morning or Thursday afternoon to talk through onboarding? Happy to work around your diary. Maya',receivedAt:'2026-07-09T09:35:00.000Z',unread:true,category:'meeting',priority:'high',riskLevel:'medium'},
 {id:'gmail-msg-support',threadId:'gmail-thread-support',from:'jamie@customer.example',to:'support@example.com',subject:'Question about my setup',snippet:'I am not sure whether I completed the setup correctly. Can someone check?',body:'Hi, I am not sure whether I completed the setup correctly. Can someone check the steps and let me know what I should do next? Jamie',receivedAt:'2026-07-09T10:05:00.000Z',unread:true,category:'customer-support',priority:'high',riskLevel:'medium'},
 {id:'gmail-msg-opportunity',threadId:'gmail-thread-opportunity',from:'partnerships@localfounders.example',to:'founder@example.com',subject:'Local founder event collaboration',snippet:'We are looking for a small business operator demo for next month.',body:'Hello, we are looking for a small business operator demo for next month. Would you be open to discussing a short session for local founders?',receivedAt:'2026-07-08T16:20:00.000Z',unread:false,category:'marketing-opportunity',priority:'medium',riskLevel:'medium'},
 {id:'gmail-msg-newsletter',threadId:'gmail-thread-newsletter',from:'newsletter@saas-roundup.example',to:'founder@example.com',subject:'This week in small business software',snippet:'Five new product updates, funding links, and productivity tips.',body:'This week in small business software: five product updates, funding links, and productivity tips. Read when useful.',receivedAt:'2026-07-08T07:10:00.000Z',unread:false,category:'newsletter',priority:'low',riskLevel:'low'}
]

const categoryAgent:Record<GmailMessageCategory,string>={
 finance:'finance',
 meeting:'founder',
 'customer-support':'customer',
 'marketing-opportunity':'marketing',
 newsletter:'founder'
}

const categoryLabel:Record<GmailMessageCategory,string>={
 finance:'Finance/Admin',
 meeting:'Scheduling',
 'customer-support':'Customer support',
 'marketing-opportunity':'Marketing opportunity',
 newsletter:'Newsletter'
}

const categoryPermission:Record<GmailMessageCategory,PermissionLevel>={
 finance:2,
 meeting:2,
 'customer-support':2,
 'marketing-opportunity':1,
 newsletter:0
}

const priorityRank:Record<GmailPriority,number>={urgent:4,high:3,medium:2,low:1}

export function getMockGmailThreads():GmailThread[]{
 if(!appMode.allowsDemoData)return []
 return mockGmailMessages.map(message=>({id:message.threadId,subject:message.subject,messages:[message],category:message.category,priority:message.priority,assignedAgentId:categoryAgent[message.category]}))
}

function countCategories(messages:GmailMessage[]):Record<GmailMessageCategory,number>{
 return messages.reduce((counts,message)=>({...counts,[message.category]:counts[message.category]+1}),{finance:0,meeting:0,'customer-support':0,'marketing-opportunity':0,newsletter:0} as Record<GmailMessageCategory,number>)
}

function draftFor(message:GmailMessage,profile?:BusinessProfile):GmailDraftReply|undefined{
 if(message.category==='newsletter')return undefined
 const business=profile?.businessName||'the business'
 const base={id:`draft-${message.id}`,messageId:message.id,threadId:message.threadId,to:message.from,subject:`Re: ${message.subject}`,tone:'warm, concise, founder-reviewed',permissionLevel:1 as PermissionLevel,requiresApproval:true,noExternalActionTaken:true}
 if(message.category==='finance')return {...base,body:`Hi,\n\nThanks for the reminder. I am checking the invoice details and will confirm the correct next step once the records have been reviewed.\n\nNo payment confirmation is being made in this draft.\n\nBest,\n${business}`}
 if(message.category==='meeting')return {...base,body:`Hi Maya,\n\nThanks, Tuesday morning or Thursday afternoon could work. Please send the best timezone and any agenda points, and I will confirm after checking availability.\n\nBest,\n${business}`}
 if(message.category==='customer-support')return {...base,body:`Hi Jamie,\n\nThanks for flagging this. I can help check the setup steps. Could you send the last step you completed and any error or confusing screen you saw?\n\nBest,\n${business}`}
 return {...base,body:`Hello,\n\nThanks for thinking of us. The collaboration sounds interesting. Could you share the expected audience, format, date, and what kind of demo would be most useful?\n\nBest,\n${business}`}
}

function actionFor(message:GmailMessage):GmailActionPlan{
 if(message.category==='finance')return {id:`action-${message.id}`,messageId:message.id,title:'Review invoice reminder before replying',assignedAgentId:'finance',permissionLevel:3,riskLevel:'restricted',suggestedAction:'Prepare a cautious invoice follow-up and ask the founder/accountant to verify the invoice. Do not pay, reconcile, or confirm financial status.',followUpTask:'Check invoice INV-2048 against source documents and ask accountant if unclear.',approvalRequired:false,blockedReason:'Payments, bank reconciliation, tax submissions, and final accounting decisions are Level 3 blocked.'}
 if(message.category==='meeting')return {id:`action-${message.id}`,messageId:message.id,title:'Prepare scheduling reply',assignedAgentId:'founder',permissionLevel:2,riskLevel:'medium',suggestedAction:'Draft a reply with possible slots and hand off to Calendar Phase 24 later. Do not create an event yet.',followUpTask:'Confirm availability before any future calendar event creation.',approvalRequired:true}
 if(message.category==='customer-support')return {id:`action-${message.id}`,messageId:message.id,title:'Draft customer support response',assignedAgentId:'customer',permissionLevel:2,riskLevel:'medium',suggestedAction:'Prepare a helpful reply asking for missing setup context. Sending requires approval.',followUpTask:'Review customer reply tone and approve only if accurate.',approvalRequired:true}
 if(message.category==='marketing-opportunity')return {id:`action-${message.id}`,messageId:message.id,title:'Qualify event opportunity',assignedAgentId:'marketing',permissionLevel:1,riskLevel:'medium',suggestedAction:'Prepare questions about audience, format, timing, and expected commitment.',followUpTask:'Decide whether the event fits current launch priorities.',approvalRequired:false}
 return {id:`action-${message.id}`,messageId:message.id,title:'Archive newsletter for later',assignedAgentId:'founder',permissionLevel:0,riskLevel:'low',suggestedAction:'No immediate action. Keep as optional reading.',followUpTask:'Review newsletter only if time allows.',approvalRequired:false}
}

export function reviewMockGmailInbox(profile?:BusinessProfile,founder?:FounderProfile):GmailReviewResult{
 const messages=(appMode.allowsDemoData?[...mockGmailMessages]:[]).sort((a,b)=>priorityRank[b.priority]-priorityRank[a.priority])
 const summary:GmailSummary={id:crypto.randomUUID(),totalMessages:messages.length,unreadCount:messages.filter(message=>message.unread).length,priorityCount:messages.filter(message=>priorityRank[message.priority]>=3).length,categories:countCategories(messages),summary:`${messages.length} mock Gmail messages reviewed: ${messages.filter(message=>priorityRank[message.priority]>=3).length} need attention, ${messages.filter(message=>message.category==='newsletter').length} can wait.`,createdAt:new Date().toISOString()}
 if(!messages.length){
  summary.summary=demoDataUnavailableSummary('Gmail')
  return {id:crypto.randomUUID(),status:gmailIntegrationStatus,summary,priorityEmails:[],risks:['No real Gmail OAuth is connected.','Demo/sample inbox data is disabled in production-preview mode.','No email has been read, drafted, sent, archived, labelled, or changed.','Future Gmail support requires backend OAuth, server-side secrets, permission review, audit logs, and approval gates.'],suggestedActions:[],draftReplies:[],approvalNeededItems:[],followUpTasks:['Run a non-integration workflow to create a local draft, or configure backend Gmail OAuth in a future backend phase.'],assignedAgentIds:['founder'],noExternalActionTaken:true,createdAt:new Date().toISOString()}
 }
 const actions=messages.map(actionFor)
 const drafts=messages.map(message=>draftFor(message,profile)).filter((draft):draft is GmailDraftReply=>Boolean(draft))
 const approvalNeededItems=actions.filter(action=>action.approvalRequired)
 return {id:crypto.randomUUID(),status:gmailIntegrationStatus,summary,priorityEmails:messages.filter(message=>priorityRank[message.priority]>=3),risks:['No real Gmail OAuth is connected.','No email has been sent.','Invoice/payment content is review-only and cannot pay, reconcile, submit tax, or provide final financial advice.','Meeting requests may hand off to Calendar Phase 24 later, but no event is created.'],suggestedActions:actions,draftReplies:drafts,approvalNeededItems,followUpTasks:actions.map(action=>action.followUpTask),assignedAgentIds:[...new Set(actions.map(action=>action.assignedAgentId))],noExternalActionTaken:true,createdAt:new Date().toISOString()}
}

export function gmailReviewToReport(review:GmailReviewResult,profile?:BusinessProfile,founder?:FounderProfile):AgentOutput{
 const priorityLines=review.priorityEmails.map(message=>`${message.priority.toUpperCase()} · ${categoryLabel[message.category]} · ${message.subject} (${message.from})`)
 const drafts=review.draftReplies.map(draft=>`To: ${draft.to}\nSubject: ${draft.subject}\n\n${draft.body}`).join('\n\n---\n\n')
 const fullOutput=[
  `GMAIL INTEGRATION STATUS\n${review.status} · backend ready · ${appMode.allowsDemoData?'mock inbox only':'no connected account; demo inbox disabled'}`,
  profile?`BUSINESS CONTEXT USED\nBusiness: ${profile.businessName}\nFounder tone: ${founder?.preferredTone||profile.preferredTone}\nCurrent goal: ${profile.currentGoal}`:'',
  `INBOX SUMMARY\n${review.summary.summary}\nUnread: ${review.summary.unreadCount}\nPriority: ${review.summary.priorityCount}`,
  `PRIORITY EMAILS\n${priorityLines.length?priorityLines.map(line=>`• ${line}`).join('\n'):'None. No Gmail account or demo inbox is connected.'}`,
  `SUGGESTED ACTIONS\n${review.suggestedActions.length?review.suggestedActions.map(action=>`• ${action.title}: ${action.suggestedAction}`).join('\n'):'No message actions were generated.'}`,
  `DRAFT REPLIES\n${drafts||'None. No Gmail messages were reviewed.'}`,
  `APPROVAL-NEEDED ITEMS\n${review.approvalNeededItems.map(action=>`• Send draft for ${action.title} after founder review.`).join('\n')||'None.'}`,
  `FOLLOW-UP TASKS\n${review.followUpTasks.map((task,index)=>`${index+1}. ${task}`).join('\n')}`,
  `RISKS AND BOUNDARIES\n${review.risks.map(risk=>`• ${risk}`).join('\n')}`,
  `NO EXTERNAL ACTION TAKEN\nSmallBiz Agent ${appMode.allowsDemoData?'reviewed mock messages only':'did not access Gmail and did not load demo messages'}. No Gmail API, OAuth, sending, payment, reconciliation, calendar event, or external side effect occurred.`
 ].filter(Boolean).join('\n\n')
 return {id:crypto.randomUUID(),agentId:'founder',title:`Review Gmail Inbox · ${appMode.allowsDemoData?'Mock report':'Local preview'}`,summary:review.summary.summary,plainEnglishSummary:review.priorityEmails.length?'SmallBiz Agent reviewed the mock Gmail inbox, prioritised important messages, prepared draft replies, and queued send-email approvals where useful.':'Gmail is backend-ready but no real account is connected and production-preview does not load demo inbox data.',fullOutput,tags:['gmail','email','inbox-review','time-back','approval','local-mock'],createdAt:review.createdAt,usefulnessRating:null,approvalNeeded:review.approvalNeededItems.length>0,riskNote:'Medium risk, Level 2 preview · draft replies are prepared only; nothing was sent. Finance/payment content remains Level 3 blocked.',futureIntegrationNote:'Future Gmail OAuth must run through backend/serverless adapters, scoped permissions, audit logs, and approval gates.',source:'workflow',permissionLevel:2,estimatedCostMode:'cheap',workflowId:'gmail-review',estimatedTimeSavedMinutes:review.priorityEmails.length?32:0,preparedAction:review.priorityEmails.length?'Review priority emails and approve only the send-email drafts you want to send later.':'Connect a future backend Gmail adapter before reviewing real inbox data.',approvalRequired:review.approvalNeededItems.length>0,outcomeStatus:review.priorityEmails.length?'gmail inbox reviewed locally':'no gmail data connected',keyFindings:[review.summary.summary,...priorityLines, ...review.risks],recommendedNextSteps:review.priorityEmails.length?['Review draft replies before approving any send-email preview.','Check the invoice reminder with source documents; do not pay or reconcile in the MVP.','Use the meeting request as a Calendar Phase 24 handoff later, but do not schedule yet.','Ignore the low-priority newsletter unless time allows.']:['Run a non-integration workflow to create local draft work.','Add backend OAuth and permission review in a future integration phase before reading Gmail.','Keep email sends approval-gated and server-side only.'],copyableText:drafts||undefined,approvalSummary:review.approvalNeededItems.length?'Send-email draft previews were added to Approvals. Approving them in this MVP only records a local decision and never sends email.':undefined,contextUsed:profile?{businessName:profile.businessName,stage:profile.stage,industry:profile.industry,currentGoal:profile.currentGoal,budgetLevel:profile.budgetLevel}:undefined}
}
