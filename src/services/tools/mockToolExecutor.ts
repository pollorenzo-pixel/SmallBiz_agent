import type { ExecutionRequest, ToolDefinition, ToolExecutionLog } from '../../types'
import type { PermissionDecision } from '../execution/permissionGate'

export function executeMockTool(tool:ToolDefinition,request:ExecutionRequest,decision:PermissionDecision):ToolExecutionLog{
 const createdAt=new Date().toISOString();const base={id:crypto.randomUUID(),toolId:tool.id,requestId:request.id,mockInput:{prompt:request.userPrompt,workflowId:request.workflowId||null,contextKeys:Object.keys(request.context)},riskLevel:tool.riskLevel,permissionLevel:tool.permissionLevel,createdAt}
 if(decision.status==='blocked'||tool.permissionLevel===3)return {...base,status:'blocked',mockOutput:{executed:false,reason:'Restricted by permission gate.'}}
 if(!tool.enabled)return {...base,status:tool.requiresApproval?'approval_required':'disabled',mockOutput:{executed:false,reason:'Future integration disabled in MVP.',futureIntegration:tool.futureIntegration}}
 if(tool.permissionLevel>decision.allowedLevel)return {...base,status:'approval_required',mockOutput:{executed:false,reason:'Approval required before any future external execution.'}}
 return {...base,status:'completed',mockOutput:{executed:true,mock:true,summary:`${tool.name} completed deterministically using local context.`,externalAction:false}}
}
