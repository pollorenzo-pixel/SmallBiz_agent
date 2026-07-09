import type { Agent, AgentOutput, Approval, BusinessProfile, FounderProfile, Goal, GoalAnalysis, GoalExecutionResult, GoalExecutionStep, GoalOrchestratorBundle, GoalPlan, PermissionLevel, ProjectWorkspaceProject, RiskLevel } from '../types'
import { agents as defaultAgents } from '../data/agents'

const includesAny = (text:string, terms:string[]) => terms.some(term => text.includes(term))
const uniq = <T,>(items:T[]) => [...new Set(items)]

const restrictedTerms = ['make payment','pay invoice','send payment','submit tax','tax return','delete production','delete database','production database','legal agreement','sign contract','commit legal','bank reconciliation','reconcile bank']
const approvalTerms = ['send email','email customer','create github issue','github issue','update database','trigger workflow','xero payment','payment draft','publish','launch ad','send outreach']

export function createGoalFromInput(input:string, profile?:BusinessProfile|FounderProfile, project?:ProjectWorkspaceProject):Goal{
 const now=new Date().toISOString(); const title=input.trim().split(/[.!?]/)[0]?.slice(0,90)||'New business goal'
 return {id:crypto.randomUUID(),title,description:input.trim(),status:'planned',priority:input.toLowerCase().includes('urgent')?'High':'Medium',createdAt:now,projectId:project?.id,profileName:'businessName' in (profile||{})?(profile as BusinessProfile).businessName:(profile as FounderProfile|undefined)?.companyName}
}

export function analyseGoal(goal:Goal):GoalAnalysis{
 const text=`${goal.title} ${goal.description}`.toLowerCase(); let goalType:GoalAnalysis['goalType']='strategy'
 if(includesAny(text,['landing page','app','bug','build','feature','technical','code','website']))goalType='technical'
 else if(includesAny(text,['marketing','post','content','customers','campaign','customer acquisition']))goalType='marketing'
 else if(includesAny(text,['invoice','cash flow','bookkeeping','admin','finance']))goalType='finance'
 else if(includesAny(text,['research','compare','market','competitor']))goalType='research'
 else if(includesAny(text,['reply','tester','lead','community','customer']))goalType='customer'
 const hasRestricted=includesAny(text,restrictedTerms); const hasApproval=includesAny(text,approvalTerms)
 return {goalType,keywords:text.split(/\W+/).filter(Boolean).slice(0,12),permissionSignals:{hasApproval,hasRestricted},riskSignals:{restricted:hasRestricted,externalAction:hasApproval},summary:`Local rules classified this as a ${goalType} goal and prepared a safe multi-agent plan.`}
}

export function selectGoalAgents(goalAnalysis:GoalAnalysis, availableAgents:Agent[]=defaultAgents){
 const leadByType:Record<GoalAnalysis['goalType'],string>={strategy:'founder',technical:'engineering',marketing:'marketing',finance:'finance',research:'research',customer:'customer'}
 const supportByType:Record<GoalAnalysis['goalType'],string[]>={strategy:['marketing','research','finance'],technical:['product','founder'],marketing:['research','customer'],finance:['founder'],research:['founder'],customer:['marketing','research']}
 const leadAgentId=availableAgents.some(a=>a.id===leadByType[goalAnalysis.goalType])?leadByType[goalAnalysis.goalType]:'founder'
 const supportingAgentIds=supportByType[goalAnalysis.goalType].filter(id=>id!==leadAgentId&&availableAgents.some(a=>a.id===id))
 return {leadAgentId,supportingAgentIds}
}

function baseSteps(goal:Goal, selected:{leadAgentId:string;supportingAgentIds:string[]}):GoalExecutionStep[]{
 const newId=()=>crypto.randomUUID(); const supports=selected.supportingAgentIds
 return [
  {id:newId(),title:'Clarify goal and success criteria',description:`Turn “${goal.title}” into a measurable outcome and assumptions list.`,agentId:selected.leadAgentId,status:'not-started',permissionLevel:0,riskLevel:'low',reason:'Read-only planning and summarisation.',confidence:91},
  {id:newId(),title:'Gather supporting perspectives',description:'Ask supporting agents for local recommendations, risks, and missing context.',agentId:supports[0]||selected.leadAgentId,status:'not-started',permissionLevel:0,riskLevel:'low',reason:'Local analysis only.',confidence:86},
  {id:newId(),title:'Draft coordinated execution plan',description:'Create a sequenced plan with owners, checks, and next actions.',agentId:selected.leadAgentId,status:'not-started',permissionLevel:1,riskLevel:'low',reason:'Creates drafts only; no external action.',confidence:88},
  {id:newId(),title:'Prepare approval previews for future external work',description:'Preview any future emails, GitHub issues, workflow triggers, database updates, or payment drafts without executing them.',agentId:supports[1]||selected.leadAgentId,status:'not-started',permissionLevel:2,riskLevel:'medium',reason:'Future external action requires human approval.',confidence:80},
  {id:newId(),title:'Save professional goal report',description:'Save the final local report and link it to the current project when available.',agentId:selected.leadAgentId,status:'not-started',permissionLevel:0,riskLevel:'low',reason:'Local persistence only.',confidence:93}
 ]
}

export function buildGoalPlan(goal:Goal, selectedAgents:{leadAgentId:string;supportingAgentIds:string[]}):GoalPlan{
 const steps=baseSteps(goal,selectedAgents); const now=new Date().toISOString()
 return {id:crypto.randomUUID(),goalId:goal.id,leadAgentId:selectedAgents.leadAgentId,supportingAgentIds:selectedAgents.supportingAgentIds,steps,riskSummary:'Low local execution risk. External actions are preview-only and restricted actions are blocked.',permissionSummary:'Level 0 analysis and Level 1 drafts may complete locally. Level 2 creates approval previews. Level 3 is blocked.',approvalIds:[],createdAt:now}
}

export function classifyGoalStepPermissions(steps:GoalExecutionStep[], goalText=''):GoalExecutionStep[]{
 const text=goalText.toLowerCase(); const restricted=includesAny(text,restrictedTerms); const approval=includesAny(text,approvalTerms)
 return steps.map(step=> restricted&&step.title.includes('approval')?{...step,title:'Blocked restricted action request',description:'The request includes payment, tax, legal commitment, bank reconciliation, production deletion, or another irreversible action.',permissionLevel:3,status:'blocked',riskLevel:'restricted',blockedReason:'Level 3 restricted actions are blocked in the MVP and no executable action was created.',reason:'Restricted action detected by local rules.',confidence:95}: approval&&step.permissionLevel===2?{...step,status:'needs-approval',riskLevel:'medium'}:step)
}

export function runMockGoalPlan(goalPlan:GoalPlan):GoalExecutionResult{
 const steps=goalPlan.steps.map(step=>step.permissionLevel===3?step:step.permissionLevel===2?{...step,status:'needs-approval' as const,outputSummary:'Created a local approval preview only. Nothing external was executed.'}:{...step,status:'completed' as const,outputSummary:'Completed locally with deterministic mock planning output.'})
 return {goalPlanId:goalPlan.id,steps,completedSummaries:steps.filter(s=>s.status==='completed').map(s=>s.outputSummary||s.title),blockedSteps:steps.filter(s=>s.status==='blocked'),approvalSteps:steps.filter(s=>s.status==='needs-approval'),createdAt:new Date().toISOString()}
}

export function createGoalApprovals(goalPlan:GoalPlan, executionResult:GoalExecutionResult, goal:Goal):Approval[]{
 return executionResult.approvalSteps.map(step=>({id:crypto.randomUUID(),title:step.title,agentId:step.agentId,proposedAction:`Review preview for “${goal.title}”: ${step.description}`,reason:'This is a Level 2 approval preview for possible future external execution. Approving only records a local decision.',confidence:step.confidence,riskLevel:step.riskLevel,status:'pending',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),sourceOutputId:goalPlan.reportId,permissionLevel:2,projectId:goal.projectId,payloadPreview:JSON.stringify({mode:'goal-orchestrator-preview',goalId:goal.id,stepId:step.id,externalExecution:false},null,2)}))
}

export function createGoalReport(goalPlan:GoalPlan, executionResult:GoalExecutionResult, goal:Goal, selected:{leadAgentId:string;supportingAgentIds:string[]}):AgentOutput{
 const lead=defaultAgents.find(a=>a.id===selected.leadAgentId); const supports=selected.supportingAgentIds.map(id=>defaultAgents.find(a=>a.id===id)?.name||id)
 const blocked=executionResult.blockedSteps.map(s=>`- ${s.title}: ${s.blockedReason||s.reason}`).join('\n')||'None.'; const approvals=executionResult.approvalSteps.map(s=>`- ${s.title}: ${s.description}`).join('\n')||'None.'
 const fullOutput=`Goal\n${goal.description}\n\nExecutive summary\n${lead?.name||'Lead agent'} coordinated a safe local plan.\n\nLead agent\n${lead?.name||selected.leadAgentId}\n\nSupporting agents\n${supports.join(', ')||'None'}\n\nExecution plan\n${executionResult.steps.map((s,i)=>`${i+1}. ${s.title} — ${s.status} — Level ${s.permissionLevel}`).join('\n')}\n\nMock completed work\n${executionResult.completedSummaries.map(x=>`- ${x}`).join('\n')}\n\nApproval-needed items\n${approvals}\n\nBlocked restricted actions\n${blocked}\n\nRisks\n${goalPlan.riskSummary}\n\nRecommended next actions\n1. Review the plan.\n2. Approve only previews you are comfortable with.\n3. Keep Level 3 work outside this MVP.\n\nConfidence\n86%`
 return {id:crypto.randomUUID(),agentId:selected.leadAgentId,title:`Goal plan: ${goal.title}`,summary:`A coordinated AI team plan for ${goal.title}.`,plainEnglishSummary:`Your AI team created a safe local plan led by ${lead?.name||selected.leadAgentId}.`,fullOutput,tags:uniq(['goal','orchestrator',goal.projectId?'project':'workspace',selected.leadAgentId,...selected.supportingAgentIds]),createdAt:new Date().toISOString(),usefulnessRating:null,approvalNeeded:executionResult.approvalSteps.length>0,riskNote:goalPlan.riskSummary,futureIntegrationNote:'Future versions can route this through the central AI Gateway, workflow engine, Supabase, and integrations after explicit approval.',permissionLevel:executionResult.blockedSteps.length?3:executionResult.approvalSteps.length?2:1,projectId:goal.projectId,source:'project-workspace',keyFindings:[`Lead agent: ${lead?.name||selected.leadAgentId}`,`Supporting agents: ${supports.join(', ')||'None'}`,goalPlan.permissionSummary],recommendedNextSteps:['Review the saved plan.','Open approvals for Level 2 preview items.','Do not use the MVP for blocked Level 3 actions.'],approvalSummary:executionResult.approvalSteps.length?'Level 2 preview items were added to Approvals. Nothing external was executed.':'No approval previews were needed.'}
}

export function orchestrateGoal(input:string, profile:BusinessProfile|FounderProfile, project?:ProjectWorkspaceProject, availableAgents:Agent[]=defaultAgents):GoalOrchestratorBundle{
 const goal=createGoalFromInput(input,profile,project); const analysis=analyseGoal(goal); const selectedAgents=selectGoalAgents(analysis,availableAgents); let plan=buildGoalPlan(goal,selectedAgents); plan={...plan,steps:classifyGoalStepPermissions(plan.steps,goal.description)}; const executionResult=runMockGoalPlan(plan); const report=createGoalReport(plan,executionResult,goal,selectedAgents); plan={...plan,reportId:report.id}; const approvals=createGoalApprovals(plan,executionResult,goal); plan={...plan,approvalIds:approvals.map(a=>a.id)}; return {goal,analysis,selectedAgents,plan,executionResult,report,approvals}
}
