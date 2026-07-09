import type { AgentOutput, BusinessProfile, CalendarActionDraft, CalendarEvent, CalendarIntegrationStatus, CalendarPriority, CalendarReviewResult, FounderProfile, PermissionLevel } from '../types'
import { appMode, demoDataUnavailableSummary } from '../config/appMode'

export const calendarIntegrationStatus:CalendarIntegrationStatus='mock-connected'

export const mockCalendarEvents:CalendarEvent[]=[
 {id:'cal-investor-call',calendarId:'primary',title:'Investor intro call',description:'Introductory call about traction, runway, and next milestones.',startAt:'2026-07-10T10:00:00.000Z',endAt:'2026-07-10T10:45:00.000Z',location:'Video call',attendees:['founder@example.com','alex@seedfund.example'],category:'investor',priority:'high',riskLevel:'medium',requiresPreparation:true},
 {id:'cal-supplier-meeting',calendarId:'primary',title:'Supplier pricing review',description:'Discuss renewal pricing and delivery timing with supplier.',startAt:'2026-07-10T13:30:00.000Z',endAt:'2026-07-10T14:00:00.000Z',location:'Phone',attendees:['founder@example.com','accounts@northstar-supplies.example'],category:'supplier',priority:'medium',riskLevel:'medium',requiresPreparation:true},
 {id:'cal-product-planning',calendarId:'primary',title:'Product planning session',description:'Review product priorities, current blockers, and next build scope.',startAt:'2026-07-11T09:30:00.000Z',endAt:'2026-07-11T10:30:00.000Z',location:'Workspace',attendees:['founder@example.com','product@example.com'],category:'product-planning',priority:'medium',riskLevel:'low',requiresPreparation:true},
 {id:'cal-feedback-call',calendarId:'primary',title:'Customer feedback call',description:'Listen to customer setup issues and identify follow-up improvements.',startAt:'2026-07-11T15:00:00.000Z',endAt:'2026-07-11T15:30:00.000Z',location:'Video call',attendees:['founder@example.com','jamie@customer.example'],category:'customer-feedback',priority:'high',riskLevel:'medium',requiresPreparation:true},
 {id:'cal-finance-reminder',calendarId:'primary',title:'Finance/admin review reminder',description:'Review invoice questions and accountant follow-ups. Do not pay, reconcile, or submit tax.',startAt:'2026-07-12T11:00:00.000Z',endAt:'2026-07-12T11:25:00.000Z',location:'Desk',attendees:['founder@example.com'],category:'finance-admin',priority:'urgent',riskLevel:'high',requiresPreparation:true}
]

const rank:Record<CalendarPriority,number>={urgent:4,high:3,medium:2,low:1}

function actionDraftFor(event:CalendarEvent):CalendarActionDraft{
 const base={id:`calendar-action-${event.id}`,eventId:event.id,assignedAgentId:'founder',proposedPayload:{calendarId:event.calendarId,eventId:event.id,title:event.title,noExternalActionTaken:true}}
 if(event.category==='finance-admin')return {...base,title:'Prepare finance/admin calendar note',permissionLevel:3 as PermissionLevel,riskLevel:'restricted' as const,proposedAction:'Prepare a review-only note for accountant questions. Do not pay, reconcile, submit tax, or make final accounting decisions.',approvalRequired:false,blockedReason:'Payments, tax submissions, bank reconciliation, legal commitments, and final accounting decisions are Level 3 blocked.'}
 if(event.category==='investor')return {...base,title:'Draft investor follow-up email',permissionLevel:2 as PermissionLevel,riskLevel:'medium' as const,proposedAction:'Prepare a follow-up email draft after the investor call. Sending requires approval and is simulated only.',approvalRequired:true}
 if(event.category==='supplier')return {...base,title:'Draft supplier meeting follow-up',permissionLevel:2 as PermissionLevel,riskLevel:'medium' as const,proposedAction:'Prepare a follow-up email and proposed calendar update if pricing review needs another meeting. No invite is sent.',approvalRequired:true}
 if(event.category==='customer-feedback')return {...base,title:'Draft customer feedback follow-up',permissionLevel:2 as PermissionLevel,riskLevel:'medium' as const,proposedAction:'Prepare a customer thank-you/follow-up message and optional future event payload. Sending or creating events requires approval.',approvalRequired:true}
 return {...base,title:'Prepare product planning agenda',permissionLevel:1 as PermissionLevel,riskLevel:'low' as const,proposedAction:'Draft agenda, questions, and internal follow-up tasks. No calendar change is made.',approvalRequired:false}
}

export function reviewMockCalendar():CalendarReviewResult{
 const events=(appMode.allowsDemoData?[...mockCalendarEvents]:[]).sort((a,b)=>rank[b.priority]-rank[a.priority])
 const actionDrafts=events.map(actionDraftFor)
 const priorityEvents=events.filter(event=>rank[event.priority]>=3)
 if(!events.length)return {
  id:crypto.randomUUID(),status:calendarIntegrationStatus,events:[],priorityEvents:[],
  summary:demoDataUnavailableSummary('Google Calendar'),
  preparationNotes:[],
  suggestedQuestions:[],
  risks:['No real Google Calendar OAuth is connected.','Demo/sample calendar data is disabled in production-preview mode.','No event has been read, created, updated, deleted, cancelled, invited, or changed.','Future Calendar support requires backend OAuth, server-side secrets, permission review, audit logs, and approval gates.'],
  nextActions:['Run a non-integration workflow for local planning, or configure backend Calendar OAuth in a future backend phase.'],
  followUpTasks:['Keep calendar event creation, updates, invites, cancellations, and follow-ups approval-gated and server-side only.'],
  approvalNeededActions:[],
  actionDrafts:[],noExternalActionTaken:true,createdAt:new Date().toISOString()
 }
 return {
  id:crypto.randomUUID(),status:calendarIntegrationStatus,events,priorityEvents,
  summary:`${events.length} mock calendar events reviewed: ${priorityEvents.length} need preparation before the next two working days.`,
  preparationNotes:[
   'Investor call: prepare traction summary, current runway assumptions, and one clear ask.',
   'Supplier meeting: compare current pricing, delivery timing, and negotiation boundary.',
   'Product planning: choose one bounded build priority and defer broad scope creep.',
   'Customer feedback call: capture exact friction points and ask what outcome would feel useful.',
   'Finance/admin reminder: prepare accountant questions only; do not pay, reconcile, or submit tax.'
  ],
  suggestedQuestions:[
   'What decision should this meeting unlock?',
   'What evidence or document should be ready before the call?',
   'What commitment should not be made without review?',
   'What follow-up can be drafted but held for approval?'
  ],
  risks:['No real Google Calendar OAuth is connected.','No event has been created, updated, deleted, cancelled, or invited.','Finance/admin calendar items are review-only and cannot pay, reconcile, submit tax, or create commitments.','Sending meeting follow-ups or creating/updating events is Level 2 approval-gated.'],
  nextActions:['Review prep notes before the investor and customer calls.','Draft follow-up messages after meetings and approve only if accurate.','Use supplier and finance meetings to gather information, not commit to payments or legal terms.'],
  followUpTasks:['Prepare investor traction bullets.','Check supplier pricing boundary.','Write product planning agenda.','List customer feedback questions.','Draft accountant questions for finance/admin reminder.'],
  approvalNeededActions:actionDrafts.filter(action=>action.approvalRequired),
  actionDrafts,noExternalActionTaken:true,createdAt:new Date().toISOString()
 }
}

export function calendarReviewToReport(review:CalendarReviewResult,profile?:BusinessProfile,founder?:FounderProfile):AgentOutput{
 const eventLines=review.priorityEvents.map(event=>`${event.priority.toUpperCase()} · ${event.title} · ${new Date(event.startAt).toLocaleString()} · ${event.attendees.join(', ')}`)
 const copyable=[
  'Calendar briefing prep',
  '',
  ...review.preparationNotes.map((note,index)=>`${index+1}. ${note}`),
  '',
  'Suggested questions',
  ...review.suggestedQuestions.map(question=>`- ${question}`),
  '',
  'Follow-up tasks',
  ...review.followUpTasks.map(task=>`- ${task}`)
 ].join('\n')
 const fullOutput=[
  `CALENDAR INTEGRATION STATUS\n${review.status} · backend ready · ${appMode.allowsDemoData?'mock calendar only':'no connected account; demo calendar disabled'}`,
  profile?`BUSINESS CONTEXT USED\nBusiness: ${profile.businessName}\nFounder tone: ${founder?.preferredTone||profile.preferredTone}\nCurrent goal: ${profile.currentGoal}`:'',
  `CALENDAR SUMMARY\n${review.summary}`,
  `PRIORITY MEETINGS\n${eventLines.length?eventLines.map(line=>`• ${line}`).join('\n'):'None. No Google Calendar account or demo calendar is connected.'}`,
  `PREPARATION NOTES\n${review.preparationNotes.length?review.preparationNotes.map(note=>`• ${note}`).join('\n'):'None. No calendar events were reviewed.'}`,
  `SUGGESTED QUESTIONS\n${review.suggestedQuestions.length?review.suggestedQuestions.map(question=>`• ${question}`).join('\n'):'None. Connect a future backend calendar adapter before preparing real meeting questions.'}`,
  `APPROVAL-NEEDED CALENDAR ACTIONS\n${review.approvalNeededActions.map(action=>`• ${action.title}: ${action.proposedAction}`).join('\n')||'None.'}`,
  `FOLLOW-UP TASKS\n${review.followUpTasks.map((task,index)=>`${index+1}. ${task}`).join('\n')}`,
  `RISKS AND BOUNDARIES\n${review.risks.map(risk=>`• ${risk}`).join('\n')}`,
  `NO EXTERNAL ACTION TAKEN\nSmallBiz Agent ${appMode.allowsDemoData?'reviewed mock calendar events only':'did not access Google Calendar and did not load demo events'}. No Google Calendar API, OAuth, event creation, update, invite, cancellation, deletion, email, payment, reconciliation, tax submission, or external side effect occurred.`
 ].filter(Boolean).join('\n\n')
 return {id:crypto.randomUUID(),agentId:'founder',title:`Calendar Briefing Assistant · ${appMode.allowsDemoData?'Mock report':'Local preview'}`,summary:review.summary,plainEnglishSummary:review.priorityEvents.length?'SmallBiz Agent reviewed the mock calendar, prepared meeting briefings, suggested questions, and queued approval-gated calendar follow-ups where useful.':'Google Calendar is backend-ready but no real account is connected and production-preview does not load demo event data.',fullOutput,tags:['calendar','schedule','meeting-briefing','time-back','approval','local-mock'],createdAt:review.createdAt,usefulnessRating:null,approvalNeeded:review.approvalNeededActions.length>0,riskNote:'Medium risk, Level 2 preview · event changes, invites, and follow-up sends are approval-gated and simulated only. Finance/admin commitments remain Level 3 blocked.',futureIntegrationNote:'Future Google Calendar OAuth must run through backend/serverless adapters, scoped permissions, audit logs, and approval gates.',source:'workflow',permissionLevel:2,estimatedCostMode:'cheap',workflowId:'calendar-review',estimatedTimeSavedMinutes:review.priorityEvents.length?28:0,preparedAction:review.priorityEvents.length?'Review meeting prep and approve only the calendar follow-up drafts you want to simulate.':'Connect a future backend Google Calendar adapter before reviewing real event data.',approvalRequired:review.approvalNeededActions.length>0,outcomeStatus:review.priorityEvents.length?'calendar briefing prepared locally':'no calendar data connected',keyFindings:[review.summary,...eventLines,...review.risks],recommendedNextSteps:review.priorityEvents.length?['Review prep notes before priority meetings.','Approve only future calendar updates or invites you genuinely want to create later.','Keep finance/admin reminders as accountant questions, not payment or reconciliation actions.']:['Run a non-integration workflow to create local planning work.','Add backend OAuth and permission review in a future integration phase before reading Google Calendar.','Keep event creation, updates, invites, cancellations, and sends approval-gated.'],copyableText:copyable.trim()?copyable:undefined,approvalSummary:review.approvalNeededActions.length?'Calendar action previews were added to Approvals. Approving them in this MVP only records a local decision and never changes a calendar.':undefined,contextUsed:profile?{businessName:profile.businessName,stage:profile.stage,industry:profile.industry,currentGoal:profile.currentGoal,budgetLevel:profile.budgetLevel}:undefined}
}
