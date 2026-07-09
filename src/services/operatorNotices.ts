import type { AgentOutput, OperatorNotice, Workflow } from '../types'
import { appMode } from '../config/appMode'
import { isRecordArray, loadLocal, saveLocal } from './storage'

const KEY = 'operator.notices'

export const seedOperatorNotices = (): OperatorNotice[] => [
 {id:'notice-email-replies',title:'3 emails may need replies',category:'Communication',summary:'Recent customer-style messages were reviewed and safe draft replies are ready to check.',suggestedAction:'Review drafts',riskLevel:'medium',permissionLevel:2,status:'drafted',estimatedTimeSavedMinutes:24,relatedAgentId:'customer',createdAt:'2026-07-09T08:10:00.000Z'},
 {id:'notice-invoice-followup',title:'1 unpaid invoice needs follow-up',category:'Finance',summary:'A polite follow-up can be prepared without sending or changing accounting records.',suggestedAction:'View approval',riskLevel:'high',permissionLevel:2,status:'new',estimatedTimeSavedMinutes:18,relatedAgentId:'finance',createdAt:'2026-07-09T08:20:00.000Z'},
 {id:'notice-meeting-slots',title:'2 meetings can be organised',category:'Planning',summary:'Two scheduling requests were spotted in mock messages. Suggested slots are ready for review.',suggestedAction:'Draft schedule',riskLevel:'medium',permissionLevel:2,status:'new',estimatedTimeSavedMinutes:20,relatedAgentId:'founder',createdAt:'2026-07-09T08:30:00.000Z'},
 {id:'notice-daily-priorities',title:'Your daily priorities are ready',category:'Admin',summary:'The operator layer grouped today’s admin, customer, and planning tasks into a short checklist.',suggestedAction:'Review',riskLevel:'low',permissionLevel:1,status:'completed',estimatedTimeSavedMinutes:15,relatedAgentId:'founder',createdAt:'2026-07-09T08:40:00.000Z'}
]

export function loadOperatorNotices(): OperatorNotice[]{
 const fallback=appMode.allowsDemoData?seedOperatorNotices():[]
 const stored=loadLocal(KEY,fallback,isRecordArray<OperatorNotice>)
 if(!appMode.allowsDemoData)return stored.filter(notice=>!seedOperatorNotices().some(seed=>seed.id===notice.id))
 return stored.length?stored:seedOperatorNotices()
}
export function saveOperatorNotices(notices:OperatorNotice[]):void{ saveLocal(KEY,notices) }

export function noticeFromWorkflow(workflow:Workflow, report:AgentOutput):OperatorNotice|null{
 const minutes=report.estimatedTimeSavedMinutes||estimateWorkflowMinutes(workflow.id)
 if(!minutes)return null
 return {id:crypto.randomUUID(),title:`${workflow.name} prepared`,category:workflow.category||'Admin',summary:report.plainEnglishSummary||report.summary,suggestedAction:report.approvalNeeded?'View approval':'Review output',riskLevel:workflow.riskLevel,permissionLevel:report.permissionLevel||1,status:report.approvalNeeded?'drafted':'completed',estimatedTimeSavedMinutes:minutes,relatedAgentId:workflow.assignedAgent,createdAt:report.createdAt}
}

export function estimateWorkflowMinutes(workflowId:string):number{
 const map:Record<string,number>={daily:15,weekly:25,'email-reply-draft':24,'meeting-scheduling':20,'task-organiser':18,'meeting-summary':22,'invoice-followup':18,invoice:18,automation:30,marketing:20,research:35,github:30,'business-plan':45,funding:30}
 return map[workflowId]||12
}

export function calculateTimeSaved(notices:OperatorNotice[],reports:AgentOutput[]){
 const noticeMinutes=notices.filter(n=>n.status==='completed'||n.status==='drafted'||n.status==='approved').reduce((sum,n)=>sum+n.estimatedTimeSavedMinutes,0)
 const reportMinutes=reports.reduce((sum,r)=>sum+(r.estimatedTimeSavedMinutes||0),0)
 const today=noticeMinutes+reportMinutes
 const demoOffset=appMode.allowsDemoData?{week:95,emails:12,drafts:3,meetings:2}:{week:0,emails:0,drafts:0,meetings:0}
 return {todayMinutes:today,weekMinutes:today+demoOffset.week,emailsReviewed:reports.filter(r=>r.workflowId==='gmail-review').length?reports.filter(r=>r.workflowId==='gmail-review').length:demoOffset.emails,draftsPrepared:notices.filter(n=>n.status==='drafted').length+demoOffset.drafts,meetingsOrganised:notices.filter(n=>n.category==='Planning').length+demoOffset.meetings,decisionsEscalated:notices.filter(n=>n.permissionLevel>=2&&n.status!=='dismissed').length}
}
