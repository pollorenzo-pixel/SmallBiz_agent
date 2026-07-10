import type { Approval, AgentOutput, OperatorNotice, ProjectActionItem, ProjectMilestone, Workflow, WorkflowRun } from '../types'
import type { FounderBriefingItem } from './founderIntelligenceService'
import type { FounderSignalState } from './founderSignalStateService'
import { RECENT_CHANGE_WINDOW_MS, RECENT_WORKFLOW_SUPPRESSION_MS } from './founderSignalStateService'

export interface FounderResolutionContext{approvals:Approval[];reports:AgentOutput[];projectActions:ProjectActionItem[];projectMilestones:ProjectMilestone[];operatorNotices:OperatorNotice[];workflowRuns:WorkflowRun[];workflows:Workflow[];now?:Date}
const age=(iso:string,now:Date)=>now.getTime()-(new Date(iso).getTime()||0)
export function resolveSignalFromEntityState(signal:FounderBriefingItem,ctx:FounderResolutionContext):boolean{
 const now=ctx.now||new Date(); const {type,id}=signal.relatedEntity
 if(type==='approval')return !ctx.approvals.some(a=>a.id===id&&(a.status==='pending'||a.status==='edited'))
 if(type==='projectAction'){const a=ctx.projectActions.find(x=>x.id===id);return !a||a.status==='done'||(signal.priority==='critical'&&a.status!=='blocked')}
 if(type==='milestone'){const m=ctx.projectMilestones.find(x=>x.id===id);return !m||m.status==='completed'}
 if(type==='report'){const r=ctx.reports.find(x=>x.id===id);return !r||!!r.usefulnessRating||age(r.createdAt,now)>RECENT_CHANGE_WINDOW_MS}
 if(type==='workflowRun'){const r=ctx.workflowRuns.find(x=>x.id===id);return !r||r.status!=='completed'||age(r.completedAt||r.updatedAt,now)>RECENT_CHANGE_WINDOW_MS}
 if(type==='notice'){const n=ctx.operatorNotices.find(x=>x.id===id);return !n||n.status==='completed'||n.status==='dismissed'}
 if(type==='recommendation'&&id.startsWith('workflow:')){const workflowId=id.split(':')[1];const wf=ctx.workflows.find(w=>w.id===workflowId);return !!wf?.lastRunAt&&age(wf.lastRunAt,now)<RECENT_WORKFLOW_SUPPRESSION_MS}
 return false
}
export function isSignalStillRelevant(signal:FounderBriefingItem,states:FounderSignalState[],ctx:FounderResolutionContext):boolean{
 if(resolveSignalFromEntityState(signal,ctx))return false
 const state=states.find(s=>s.signalKey===signal.dismissalKey)
 if(!state)return true
 if(state.status==='resolved')return false
 if(state.status==='dismissed')return signal.requiresApproval || !signal.allowTemporaryDismiss
 if(state.status==='viewed'&&signal.category==='what_changed')return false
 if(state.status==='snoozed')return !state.snoozedUntil || new Date(state.snoozedUntil).getTime()<= (ctx.now||new Date()).getTime()
 return true
}
