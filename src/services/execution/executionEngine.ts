import type { AgentOutput, Approval, BusinessProfile, ExecutionRequest, ExecutionResult, FounderProfile, ToolExecutionLog, Workflow } from '../../types'
import { agents } from '../../data/agents'
import { createApproval } from '../approvalService'
import { runWorkflow } from '../workflowRunner'
import { getSelectedProvider } from '../ai/providers'
import { generateProviderOutput } from '../ai/mockProvider'
import { getWorkflowTools } from '../tools/toolRegistry'
import { executeMockTool } from '../tools/mockToolExecutor'
import { evaluatePermission, type PermissionDecision } from './permissionGate'
import { saveExecutionResult, saveToolExecutionLogs } from './executionLogsStorage'

export interface ExecutionBundle{request:ExecutionRequest;result:ExecutionResult;decision:PermissionDecision;logs:ToolExecutionLog[];report?:AgentOutput;approval?:Approval}
export async function executeWorkflow(workflow:Workflow,business?:BusinessProfile,founder?:FounderProfile):Promise<ExecutionBundle>{
 const agent=agents.find(item=>item.id===workflow.assignedAgent);if(!agent)throw new Error('Assigned agent is unavailable.')
 const provider=getSelectedProvider();if(!provider.enabled||!provider.isMock)throw new Error('Only Mock Local Provider may execute in the MVP.')
 const tools=getWorkflowTools(workflow.id);const permissionLevel=workflow.riskLevel==='restricted'?3:workflow.requiresApproval?2:Math.max(0,...tools.map(tool=>tool.permissionLevel)) as 0|1|2|3
 const request:ExecutionRequest={id:crypto.randomUUID(),source:'workflow',agentId:agent.id,workflowId:workflow.id,providerId:provider.id,toolIds:tools.map(tool=>tool.id),userPrompt:`Run ${workflow.name}`,context:{businessProfile:business||null,founderProfile:founder||null},permissionLevel,riskLevel:workflow.riskLevel,requiresApproval:workflow.requiresApproval,createdAt:new Date().toISOString()}
 const decision=evaluatePermission(request);const logs=tools.map(tool=>executeMockTool(tool,request,decision));saveToolExecutionLogs(logs)
 const resultId=crypto.randomUUID();
 if(decision.status==='blocked'){
  const result:ExecutionResult={id:resultId,requestId:request.id,providerId:provider.id,agentId:agent.id,workflowId:workflow.id,status:'blocked',summary:decision.explanation,structuredOutput:generateProviderOutput(provider,request,logs),toolResults:logs.map(log=>log.mockOutput),warnings:[decision.explanation,'No report, approval, provider call, or external action was created.'],createdAt:new Date().toISOString()};saveExecutionResult(result);return {request,result,decision,logs}
 }
 const approval=decision.status==='approval_required'?createApproval(workflow)||undefined:undefined
 const report=await runWorkflow(workflow,Boolean(approval),business,founder)
 report.execution={executionResultId:resultId,providerId:provider.id,providerName:provider.name,simulatedTools:tools.map(tool=>tool.id),permissionDecision:decision.explanation,approvalStatus:approval?'local approval created':'not required'}
 const result:ExecutionResult={id:resultId,requestId:request.id,providerId:provider.id,agentId:agent.id,workflowId:workflow.id,status:approval?'approval_required':'completed',summary:report.summary,structuredOutput:generateProviderOutput(provider,request,logs),toolResults:logs.map(log=>log.mockOutput),approvalId:approval?.id,reportId:report.id,warnings:['Mock Local Provider only.','No external action or network request occurred.'],createdAt:new Date().toISOString()};saveExecutionResult(result)
 return {request,result,decision,logs,report,approval:approval?{...approval,sourceOutputId:report.id}:undefined}
}
