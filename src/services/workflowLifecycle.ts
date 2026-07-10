import type { StepStatus, Workflow } from '../types'

export type WorkflowLifecycleState='ready'|'planning'|'working'|'waiting-approval'|'needs-input'|'completed'|'failed'|'cancelled'

export const workflowLifecycleCopy:Record<WorkflowLifecycleState,{label:string;summary:string;next:string}>={
 ready:{label:'Ready to start',summary:'The workflow goal and safety boundaries are ready for review.',next:'Start when the goal looks right.'},
 planning:{label:'Planning',summary:'Preparing a safe plan from the information available in this browser.',next:'The first step will begin after the plan is prepared.'},
 working:{label:'Working',summary:'Reviewing the available information and preparing the output.',next:'You can leave this page and return while the local work finishes.'},
 'waiting-approval':{label:'Waiting for approval',summary:'The draft is ready, but a sensitive next step needs your decision.',next:'Review the approval before anything can move forward.'},
 'needs-input':{label:'Needs input',summary:'The workflow needs more information before it can continue.',next:'Provide the missing detail or return safely.'},
 completed:{label:'Completed',summary:'Work completed and the report is ready to review.',next:'Open the report and choose the recommended next action.'},
 failed:{label:'Could not complete',summary:'The workflow stopped safely and no external action was taken.',next:'Review the message and try again when ready.'},
 cancelled:{label:'Cancelled',summary:'The workflow was cancelled without making an external change.',next:'Return to Today or start again when ready.'}
}

export function workflowLifecycle(workflow:Workflow,running:string|null):WorkflowLifecycleState{
 if(running===workflow.id)return 'working'
 if(workflow.status==='complete')return workflow.requiresApproval?'waiting-approval':'completed'
 return 'ready'
}

export const workflowStepLabel:Record<StepStatus,string>={
 'not-started':'Remaining',running:'Current step',completed:'Completed','needs-approval':'Waiting for approval',blocked:'Unavailable'
}
