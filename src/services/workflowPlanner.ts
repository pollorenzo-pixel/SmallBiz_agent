import type { AIGatewayRequest, AIGatewayResult, BudgetGuardResult, ExecutionMode, FounderProfile, OperatorPlan, Workflow } from '../types'
import { runAIGatewayTask } from './aiGateway'
import { runAIGatewayTaskViaBackend } from './aiGatewayClient'

function requestForWorkflow(workflow:Workflow,founder?:FounderProfile,userCommand?:string):AIGatewayRequest{
 return {id:crypto.randomUUID(),taskType:workflow.category||'Admin',title:workflow.name,prompt:userCommand||workflow.description,agentId:workflow.assignedAgent,workflowId:workflow.id,requestedPermissionLevel:workflow.riskLevel==='restricted'?3:workflow.requiresApproval?2:undefined,requiresApproval:workflow.requiresApproval,context:{founderProfile:founder||null}}
}

function planFromGateway(workflow:Workflow,request:AIGatewayRequest,gateway:AIGatewayResult):OperatorPlan{
 const mode:ExecutionMode=gateway.permission.level>=3?'blocked':gateway.approval.requiresApproval?'approval-required':'prepare-only'
 const budgetGuard:BudgetGuardResult=gateway.budgetGuard
 return {id:crypto.randomUUID(),title:`Operator plan · ${workflow.name}`,detectedIntent:request.taskType,assignedAgentId:workflow.assignedAgent,steps:workflow.steps.map((title,index)=>({id:`step-${index+1}`,title,status:mode==='blocked'&&index===workflow.steps.length-1?'blocked':'not-started'})),permissionLevel:gateway.permission.level,requiresApproval:gateway.approval.requiresApproval,modelRoute:gateway.modelRoute,budgetGuard,expectedOutput:workflow.requiresApproval?'Prepared draft plus local approval preview':'Prepared local report or draft',executionMode:mode,createdAt:gateway.createdAt}
}

export function createOperatorPlan(workflow:Workflow,founder?:FounderProfile,userCommand?:string):OperatorPlan{
 const request=requestForWorkflow(workflow,founder,userCommand)
 return planFromGateway(workflow,request,runAIGatewayTask(request))
}

export async function createOperatorPlanViaGateway(workflow:Workflow,founder?:FounderProfile,userCommand?:string):Promise<{plan:OperatorPlan;gateway:AIGatewayResult}>{
 const request=requestForWorkflow(workflow,founder,userCommand)
 const gateway=await runAIGatewayTaskViaBackend(request)
 return {plan:planFromGateway(workflow,request,gateway),gateway}
}
