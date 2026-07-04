import type { AIProvider, ExecutionRequest, ToolExecutionLog } from '../../types'

export function generateProviderOutput(provider:AIProvider,request:ExecutionRequest,logs:ToolExecutionLog[]){
 return {provider:provider.name,mode:'mock-local',message:'This is a mock local AI output generated for MVP testing.',agentId:request.agentId,workflowId:request.workflowId||null,toolsSimulated:logs.filter(log=>log.status==='completed').map(log=>log.toolId),toolsAwaitingApproval:logs.filter(log=>log.status==='approval_required').map(log=>log.toolId),profileContextAvailable:Object.keys(request.context).length>0}
}
