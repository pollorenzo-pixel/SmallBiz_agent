export type RiskLevel = 'low' | 'medium' | 'high' | 'restricted'
export type PermissionLevel = 0 | 1 | 2 | 3
export type StepStatus = 'not-started' | 'running' | 'completed' | 'needs-approval' | 'blocked'
export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'approval_required' | 'blocked' | 'failed'

export type AIProviderMode = 'mock'|'openai-compatible'
export type AIModelRouteId = 'cheap-admin'|'standard-draft'|'reasoning-plan'|'coding-bounded'|'restricted-blocked'
export type CostBand = 'low'|'medium'|'high'|'blocked'
export type BudgetStatus = 'pass'|'warn'|'blocked'
export type ExecutionMode = 'prepare-only'|'approval-required'|'blocked'
export interface AIProviderConfig { mode:AIProviderMode; providerName:string; apiBaseUrlPlaceholder?:string; apiKeyPlaceholder?:string; isActive:boolean; notes:string }
export interface AIModelRoute { id:AIModelRouteId; displayName:string; intendedModelTier:string; reason:string; estimatedCostBand:CostBand; defaultPermissionLevel:PermissionLevel }
export interface AIGatewayRequest { id:string; taskType:string; prompt:string; title?:string; agentId?:string; workflowId?:string; requestedPermissionLevel?:PermissionLevel; requiresApproval?:boolean; providerConfig?:AIProviderConfig; context?:Record<string,unknown> }
export interface AIResponseContract {
  title:string; summary:string; fullOutput:string; nextActions:string[]; approvalItems:string[]
  tasks:string[]; risks:string[]; confidence:number; timeSavedEstimateMinutes:number; noExternalActionTaken:boolean
}
export interface AIGatewayStructuredOutput extends AIResponseContract { [key:string]:unknown }
export interface BudgetGuardResult { estimatedTokenUsage:number; estimatedCostBand:CostBand; budgetStatus:BudgetStatus; reason:string; recommendedCheaperRoute?:AIModelRouteId }
export interface AIGatewayResult { id:string; requestId:string; providerMode:AIProviderMode; providerName:string; output:string; structuredOutput:AIGatewayStructuredOutput; modelRoute:AIModelRoute; budgetGuard:BudgetGuardResult; permission:{level:PermissionLevel;label:string;reason:string}; approval:{requiresApproval:boolean;status:'not-required'|'required'|'blocked';reason:string}; createdAt:string; warnings?:string[]; backend?:{attempted:boolean;used:boolean;fallback:boolean;reason?:string} }
export interface OperatorPlanStep { id:string; title:string; status:StepStatus }
export interface OperatorPlan { id:string; title:string; detectedIntent:string; assignedAgentId:string; steps:OperatorPlanStep[]; permissionLevel:PermissionLevel; requiresApproval:boolean; modelRoute:AIModelRoute; budgetGuard:BudgetGuardResult; expectedOutput:string; executionMode:ExecutionMode; createdAt:string }

export interface BusinessProfile {
  id: string; founderName: string; businessName: string; stage: string; industry: string
  productOrService: string; targetCustomer: string; currentGoal: string; biggestChallenge: string
  budgetLevel: string; preferredTone: string; riskComfort: string; desiredIntegrations: string[]
  createdAt: string; updatedAt: string
}
export type BusinessContextUsed = Pick<BusinessProfile,'businessName'|'stage'|'industry'|'currentGoal'|'budgetLevel'>
export interface FounderProfile {
  id:string; name:string; companyName:string; mainProjects:string[]; businessStage:string
  currentPriorities:string[]; preferredTone:string; riskPreference:string
  defaultPermissionLevel:PermissionLevel; createdAt:string; updatedAt:string
  businessType:string; goals:string[]; projects:string[]; helpLevel:string; onboardingCompleted:boolean
}

export interface Agent {
  id: string; name: string; role: string; description: string
  capabilities: string[]; boundaries: string[]; examplePrompts: string[]; defaultOutputFormat: string
}
export type WorkflowCategory = 'Admin'|'Communication'|'Planning'|'Finance'|'Marketing'|'Product'|'Coding'|'Research'
export type OperatorNoticeStatus = 'new'|'drafted'|'approved'|'dismissed'|'completed'
export interface Workflow {
  id: string; name: string; description: string; assignedAgent: string; steps: string[]
  status: 'ready' | 'running' | 'complete'; lastRunAt?: string; riskLevel: RiskLevel; requiresApproval: boolean; category?:WorkflowCategory
}
export interface OperatorNotice {
  id:string; title:string; category:WorkflowCategory; summary:string; suggestedAction:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; status:OperatorNoticeStatus; estimatedTimeSavedMinutes:number; relatedAgentId:string; createdAt:string
}
export interface Approval {
  id: string; title: string; agentId: string; proposedAction: string; reason: string
  confidence: number; riskLevel: RiskLevel; status: 'pending' | 'approved' | 'rejected' | 'edited' | 'blocked'; createdAt: string; sourceOutputId?: string
  permissionLevel?: PermissionLevel; payloadPreview?: string; editedAction?: string; rejectionReason?: string; decidedAt?: string
  updatedAt?:string; approvedAt?:string; rejectedAt?:string
  projectId?:string
}
export interface AgentOutput {
  id: string; agentId: string; title: string; summary: string; fullOutput: string
  tags: string[]; createdAt: string; usefulnessRating: 'useful' | 'not-useful' | null
  approvalNeeded: boolean; riskNote: string; futureIntegrationNote: string
  operatorPlan?:OperatorPlan; aiGateway?:AIGatewayResult
  source?: 'workflow'|'command-center'|'direct-agent'|'business-builder'|'automation-blueprint'|'self-audit'|'skill-gap'|'project-workspace'|'agentic-execution'
  permissionLevel?: PermissionLevel; estimatedCostMode?: 'cheap'|'standard'|'premium'; skillStatus?: SkillStatus
  contextUsed?: BusinessContextUsed
  workflowId?:string; plainEnglishSummary?:string; keyFindings?:string[]; recommendedNextSteps?:string[]
  copyableText?:string; approvalSummary?:string
  projectId?:string; sourceProjectTitle?:string; projectActionType?:string
  builderPlan?:BuilderPlanData
  execution?: { executionResultId:string; providerId:string; providerName:string; simulatedTools:string[]; permissionDecision:string; approvalStatus:string }
  estimatedTimeSavedMinutes?:number; preparedAction?:string; approvalRequired?:boolean; outcomeStatus?:string
}
export interface BuilderPlanData { builderWorkflowId:string; builderType:string; basedOn:Array<{label:string;value:string}>; sections:Array<{title:string;content:string}>; suggestedMilestones:string[]; approvalFutureActions:string[]; safetyNote:string }
export interface AIProvider { id:string; name:string; type:string; status:'active'|'disabled'|'placeholder'; description:string; capabilities:string[]; authType:string; supportsStreaming:boolean; supportsTools:boolean; riskLevel:RiskLevel; isMock:boolean; enabled:boolean }
export interface ToolDefinition { id:string; name:string; description:string; category:string; permissionLevel:PermissionLevel; riskLevel:RiskLevel; requiresApproval:boolean; inputSchemaDescription:string; outputSchemaDescription:string; enabled:boolean; isMock:boolean; futureIntegration:string }
export interface ExecutionRequest { id:string; source:string; agentId:string; workflowId?:string; providerId:string; toolIds:string[]; userPrompt:string; context:Record<string,unknown>; permissionLevel:PermissionLevel; riskLevel:RiskLevel; requiresApproval:boolean; createdAt:string }
export interface ExecutionResult { id:string; requestId:string; providerId:string; agentId:string; workflowId?:string; status:'completed'|'approval_required'|'blocked'|'failed'; summary:string; structuredOutput:Record<string,unknown>; toolResults:Array<Record<string,unknown>>; approvalId?:string; reportId?:string; warnings:string[]; createdAt:string }
export interface ToolExecutionLog { id:string; toolId:string; requestId:string; status:'completed'|'approval_required'|'blocked'|'disabled'|'failed'; mockInput:Record<string,unknown>; mockOutput:Record<string,unknown>; riskLevel:RiskLevel; permissionLevel:PermissionLevel; createdAt:string }
export type SkillStatus = 'available'|'draft'|'needs_review'|'blocked'|'future_integration'
export interface SkillModule { id:string; name:string; description:string; category:string; status:SkillStatus; triggerPhrases:string[]; requiredInputs:string[]; outputFormat:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; version:string; createdAt:string; lastUpdatedAt:string }
export interface SkillGapReport { id:string; requestedCapability:string; userPrompt:string; detectedGap:string; suggestedSkillName:string; suggestedWorkflow:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; recommendedReview:string; status:SkillStatus; createdAt:string }
export interface AICostGuardrail { id:string; name:string; description:string; enabled:boolean; limitType:string; mockLimit?:string; actionWhenLimitReached:'block'|'require-approval'|'recommend-cheap'|'require-summary' }
export interface MockAgentResult { agentId:string; prompt:string; output?:AgentOutput; approvalDraft?:Approval; blockedReason?:string; recommendedWorkflowId?:string; skillGapReport?:SkillGapReport }
export interface WorkflowResult {
  workflowId: string; workflowName: string; agentId: string; reportId: string
  reportSummary: string; approvalId?: string; riskLevel: RiskLevel; createdAt: string
  providerName?:string; simulatedTools?:string[]; permissionDecision?:string; executionResultId?:string
  plainEnglishSummary?:string; keyFindings?:string[]; recommendedNextSteps?:string[]; copyableText?:string; approvalSummary?:string
  operatorPlan?:OperatorPlan; aiGateway?:AIGatewayResult
}
export interface CommandRouteSuggestion {
  id:string; originalCommand:string; recommendedAgentId:string; recommendedWorkflowId:string
  confidence:'low'|'medium'|'high'; reason:string; interpretedNeed:string; safetyNote:string
  suggestedNextStep:string; alternativeWorkflowIds:string[]; blocked?:boolean
}
export interface CommandHistoryItem {
  id:string; command:string; recommendedAgentId:string; recommendedWorkflowId:string; createdAt:string
}

export type ProjectType = 'Business idea'|'Website'|'App'|'Launch plan'|'Marketing campaign'|'Finance/admin'|'Research'|'Other'
export type ProjectStage = 'Idea'|'Planning'|'Building'|'Reviewing'|'Launching'|'Active'|'Paused'
export type ProjectStatus = 'Draft'|'In progress'|'Needs review'|'Waiting for approval'|'Complete'|'Paused'
export type ProjectPriority = 'Low'|'Medium'|'High'
export interface ProjectNote { id:string; text:string; createdAt:string }
export interface ProjectNextAction { id:string; text:string; done:boolean; createdAt:string; completedAt?:string }
export interface ProjectWorkspaceProject {
  id:string; name:string; type:ProjectType; description:string; status:ProjectStatus; stage:ProjectStage; priority:ProjectPriority
  ownerGoal:string; createdAt:string; updatedAt:string; linkedOutputIds:string[]; linkedApprovalIds:string[]; notes:ProjectNote[]; nextActions:ProjectNextAction[]; lastAiHelpAt?:string
}
export type ProjectHelpActionType='next-steps'|'product-tasks'|'marketing-draft'|'coding-prompt'|'research'|'finance-review'
export interface ProjectHelpBundle { output:AgentOutput; approval?:Approval }
export type ProjectMilestoneStatus='planned'|'active'|'completed'
export interface ProjectMilestone { id:string; projectId:string; title:string; description:string; status:ProjectMilestoneStatus; createdAt:string; updatedAt:string; completedAt?:string }
export type ProjectActionStatus='todo'|'doing'|'blocked'|'done'
export interface ProjectActionItem { id:string; projectId:string; milestoneId?:string; sourceOutputId?:string; sourceApprovalId?:string; title:string; description:string; status:ProjectActionStatus; priority:'low'|'medium'|'high'; createdAt:string; updatedAt:string; completedAt?:string }
export type BuilderCategory='website'|'offer'|'launch'|'ads'|'app'|'automation'
export interface BuilderInputPrompt { id:string; label:string; helper:string; placeholder:string; defaultValue:string }
export interface BuilderWorkflow {
  id:string; name:string; description:string; assignedAgentIds:string[]; category:BuilderCategory; bestFor:string
  inputPrompts:BuilderInputPrompt[]; outputSections:string[]; suggestedActionTemplates:string[]; suggestedMilestoneTemplates:string[]
  riskLevel:RiskLevel; permissionLevel:PermissionLevel; requiresApprovalPreview:boolean; mockOnlyNotice:string
}
export interface BuilderRun {
  id:string; projectId:string; builderWorkflowId:string; createdAt:string; inputs:Record<string,string>; reportId:string
  generatedActionIds:string[]; generatedMilestoneIds:string[]; generatedApprovalIds:string[]
}
export interface BuilderRunBundle { run:BuilderRun; output:AgentOutput; actions:ProjectActionItem[]; milestones:ProjectMilestone[]; approvals:Approval[] }
export type FounderMatchStatus='suggested'|'saved'|'dismissed'|'drafted'
export interface FounderMatch { id:string; name:string; businessName:string; industry:string; niche:string; stage:string; location:string; goals:string[]; matchReason:string; relevanceScore:number; suggestedApproach:string; tags:string[]; status:FounderMatchStatus; createdAt:string }
export interface ConnectionDraft { id:string; matchId:string; agentId:string; title:string; message:string; shortVersion:string; tone:string; callToAction:string; riskLevel:RiskLevel; approvalId:string; createdAt:string }
export interface ConnectionDraftBundle { draft:ConnectionDraft; output:AgentOutput; approval:Approval }
export interface DailyFocusSummary { projectId?:string; projectName?:string; topPriorities:ProjectActionItem[]; stuckItems:ProjectActionItem[]; nextMilestone?:ProjectMilestone; pendingApprovals:Approval[]; latestReport?:AgentOutput; suggestedAction:string; suggestedAgentId:string; focusMessage:string }
export interface EndOfDayReviewInput { projectId?:string; doneToday:string; stillBlocked:string; moveToTomorrow:string; noteForAi:string }

export interface Goal { id:string; title:string; description:string; status:'planned'|'running'|'completed'|'needs-approval'|'blocked'; priority:ProjectPriority; createdAt:string; projectId?:string; profileName?:string }
export interface GoalAnalysis { goalType:'strategy'|'technical'|'marketing'|'finance'|'research'|'customer'; keywords:string[]; permissionSignals:{hasApproval:boolean;hasRestricted:boolean}; riskSignals:{restricted:boolean;externalAction:boolean}; summary:string }
export interface GoalPlan { id:string; goalId:string; leadAgentId:string; supportingAgentIds:string[]; steps:GoalExecutionStep[]; riskSummary:string; permissionSummary:string; approvalIds:string[]; reportId?:string; createdAt:string }
export interface GoalExecutionStep { id:string; title:string; description:string; agentId:string; status:StepStatus; permissionLevel:PermissionLevel; riskLevel:RiskLevel; reason:string; confidence:number; outputSummary?:string; blockedReason?:string }
export interface GoalExecutionResult { goalPlanId:string; steps:GoalExecutionStep[]; completedSummaries:string[]; blockedSteps:GoalExecutionStep[]; approvalSteps:GoalExecutionStep[]; createdAt:string }
export interface GoalOrchestratorBundle { goal:Goal; analysis:GoalAnalysis; selectedAgents:{leadAgentId:string;supportingAgentIds:string[]}; plan:GoalPlan; executionResult:GoalExecutionResult; report:AgentOutput; approvals:Approval[] }

export interface AgentExecutionResult {
  id:string; stepId:string; agentId:string; status:ExecutionStatus; summary:string; output:string
  confidence:number; createdAt:string; warnings:string[]
}
export interface AgentExecutionStep {
  id:string; runId:string; title:string; description:string; agentId:string; status:ExecutionStatus
  permissionLevel:PermissionLevel; riskLevel:RiskLevel; reason:string; confidence:number
  startedAt?:string; completedAt?:string; approvalId?:string; blockedReason?:string; result?:AgentExecutionResult
}
export interface AgentLearning {
  id:string; runId:string; agentId:string; learning:string; confidence:number; createdAt:string
}
export interface CompanyMemoryEvent {
  id:string; runId:string; type:'goal'|'decision'|'preference'|'risk'|'approval'|'blocked_action'|'learning'
  title:string; summary:string; agentId?:string; relatedGoalId?:string; relatedReportId?:string; relatedApprovalId?:string
  createdAt:string; tags:string[]
}
export type BusinessMemoryEvent = CompanyMemoryEvent
export interface WorkflowRun {
  id:string; goalId:string; goalTitle:string; goalDescription:string; workflowName:string
  leadAgentId:string; supportingAgentIds:string[]; status:ExecutionStatus; steps:AgentExecutionStep[]
  resultIds:string[]; reportId?:string; approvalIds:string[]; memoryEventIds:string[]
  createdAt:string; updatedAt:string; completedAt?:string; blockedReason?:string
  localOnlyNotice:string
}
export interface AgenticExecutionBundle {
  run:WorkflowRun; report:AgentOutput; approvals:Approval[]; memoryEvents:CompanyMemoryEvent[]; learnings:AgentLearning[]
}


export interface Integration {
  id: string; name: string; status: 'placeholder'|'mock-connected'|'backend-ready'; description: string; authType: string
  permissions: PermissionLevel[]; riskLevel: RiskLevel
}

export type GmailMessageCategory='finance'|'meeting'|'customer-support'|'marketing-opportunity'|'newsletter'
export type GmailPriority='urgent'|'high'|'medium'|'low'
export type GmailIntegrationStatus='mock-connected'|'backend-ready'|'needs-oauth'|'disabled'
export interface GmailMessage {
  id:string; threadId:string; from:string; to:string; subject:string; snippet:string; body:string
  receivedAt:string; unread:boolean; category:GmailMessageCategory; priority:GmailPriority; riskLevel:RiskLevel
}
export interface GmailThread { id:string; subject:string; messages:GmailMessage[]; category:GmailMessageCategory; priority:GmailPriority; assignedAgentId:string }
export interface GmailDraftReply { id:string; messageId:string; threadId:string; to:string; subject:string; body:string; tone:string; permissionLevel:PermissionLevel; requiresApproval:boolean; noExternalActionTaken:boolean }
export interface GmailActionPlan { id:string; messageId:string; title:string; assignedAgentId:string; permissionLevel:PermissionLevel; riskLevel:RiskLevel; suggestedAction:string; followUpTask:string; approvalRequired:boolean; blockedReason?:string }
export interface GmailSummary { id:string; totalMessages:number; unreadCount:number; priorityCount:number; categories:Record<GmailMessageCategory,number>; summary:string; createdAt:string }
export interface GmailReviewResult {
  id:string; status:GmailIntegrationStatus; summary:GmailSummary; priorityEmails:GmailMessage[]; risks:string[]
  suggestedActions:GmailActionPlan[]; draftReplies:GmailDraftReply[]; approvalNeededItems:GmailActionPlan[]
  followUpTasks:string[]; assignedAgentIds:string[]; noExternalActionTaken:boolean; createdAt:string
}

export type CalendarEventCategory='investor'|'supplier'|'product-planning'|'customer-feedback'|'finance-admin'
export type CalendarPriority='urgent'|'high'|'medium'|'low'
export type CalendarIntegrationStatus='mock-connected'|'backend-ready'|'needs-oauth'|'disabled'
export interface CalendarEvent {
  id:string; calendarId:string; title:string; description:string; startAt:string; endAt:string; location?:string
  attendees:string[]; category:CalendarEventCategory; priority:CalendarPriority; riskLevel:RiskLevel; requiresPreparation:boolean
}
export interface CalendarActionDraft {
  id:string; eventId:string; title:string; assignedAgentId:string; permissionLevel:PermissionLevel; riskLevel:RiskLevel
  proposedAction:string; proposedPayload:Record<string,unknown>; approvalRequired:boolean; blockedReason?:string
}
export interface CalendarReviewResult {
  id:string; status:CalendarIntegrationStatus; events:CalendarEvent[]; priorityEvents:CalendarEvent[]
  summary:string; preparationNotes:string[]; suggestedQuestions:string[]; risks:string[]
  nextActions:string[]; followUpTasks:string[]; approvalNeededActions:CalendarActionDraft[]
  actionDrafts:CalendarActionDraft[]; noExternalActionTaken:boolean; createdAt:string
}
