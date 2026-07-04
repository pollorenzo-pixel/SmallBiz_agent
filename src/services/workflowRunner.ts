import type { AgentOutput, BusinessProfile, Workflow } from '../types'
import { generateMockCompletion } from './modelAdapter'

interface MockReportTemplate {
  summary: string
  findings: string[]
  actions: string[]
  details: string[]
  riskNote: string
  futureIntegrationNote: string
  tags: string[]
}

const templates: Record<string, MockReportTemplate> = {
  'business-plan': {
    summary:'A service-led small business can validate demand cheaply, reach first revenue within 30 days, and add automation only after the offer is proven.',
    findings:['Executive summary: Start with one clear customer problem and a productised starter offer.','Customer profile: Time-poor UK micro-business owners who need practical execution support.','Offer: A fixed-scope setup package followed by optional monthly support.','Pricing assumptions: £350 starter package; £95 monthly support; validate willingness to pay before expanding.'],
    actions:['Interview five target customers this week.','Pre-sell two starter packages before buying non-essential tools.','Create a one-page landing page and a manual delivery checklist.'],
    details:['One-page plan — Problem: fragmented small-business execution. Solution: a guided setup and operating service. Channel: founder-led outreach and referrals. Revenue: setup fee plus recurring support.','Full plan outline: company purpose; market placeholder; customer evidence; offer; operations; go-to-market; financial assumptions; risks; milestones.','12-month forecast placeholder: M1 revenue £0 / costs £120; M3 revenue £700 / costs £180; M6 revenue £1,750 / costs £350; M12 revenue £4,000 / costs £850. These are editable assumptions, not predictions.','Startup costs: domain £15, basic software £60, test marketing £100; defer branding, office, custom development, and paid automation.','Funding options: customer pre-sales, services-first bootstrapping, local grant research, partnership revenue share. No funding is guaranteed.','First 30 days: validate, package offer, pre-sell, deliver manually, review evidence.','Editable Excel forecast export planned for a later phase.'],
    riskNote:'Medium context, Level 1 draft · business and forecast assumptions require validation; not financial, legal, tax, or accounting advice.',
    futureIntegrationNote:'Future approved connectors could add cited market research, local Excel generation, CRM tasks, and funding-application drafts without submitting them.', tags:['business-builder','business-plan','forecast-placeholder','launch']
  },
  funding: {
    summary:'The leanest funding strategy is to reduce the initial need, pre-sell a narrow offer, and use first revenue to fund later tooling.',
    findings:['Funding need placeholder: £500 for a 30-day validation run.','Must-have costs: basic registration research, domain, essential software, and direct customer discovery.','Delay: custom branding, office space, paid automation, broad advertising, and speculative development.'],
    actions:['Define a pre-sellable starter offer.','Ask ten prospects for paid pilot commitments.','Research grants, responsible lending, or investment only after validating demand.'],
    details:['Bootstrapping: services-first delivery, free tiers, customer-funded pilots, shared tools.','Pre-sale ideas: founding-customer package, paid discovery workshop, refundable reservation.','Partnerships: referral share with accountants, local agencies, or trade groups.','Funding route placeholders: local grants, start-up loans, community finance, angel investment; eligibility and terms require independent verification.','First revenue experiment: sell two £250 pilots before committing to recurring costs.'],
    riskNote:'Medium context, Level 1 draft · general information only, not financial advice; no application, loan, or commitment was made.',
    futureIntegrationNote:'Future integrations could surface verified funding sources and draft applications, but submission would require Level 2 approval.', tags:['business-builder','funding','bootstrapping','no-financial-advice']
  },
  automation: {
    summary:'A customer-reply process can be streamlined with structured intake, draft generation, and a mandatory human review before sending.',
    findings:['Current manual steps: read enquiry, classify intent, find context, draft response, review, send, log outcome.','Automation opportunity: classify and prepare a draft while preserving the human checkpoint.','Proposed trigger: new customer enquiry received.','Proposed actions: extract context, choose template, draft reply, flag sensitivity, queue for approval.'],
    actions:['Document five common enquiry types.','Define sensitive topics that always escalate.','Test drafts against ten fictional cases before any future integration.'],
    details:['Required tools placeholder: Gmail or helpdesk, customer records, template library, webhook/orchestration layer.','Approval points: every outbound reply in the MVP; sensitive complaints remain manual.','Implementation plan: map → prototype locally → test → review permissions → connect read-only → pilot with approvals.','Testing: missing context, angry customer, refund request, personal data, duplicate message, outage.'],
    riskNote:'Medium risk, Level 2 preview · blueprint generation is local; triggering workflows or sending replies would require approval.',
    futureIntegrationNote:'A future Gmail, Supabase, webhook, Sim/OpenClaw-style orchestrator could implement this behind server-side approvals.', tags:['automation','blueprint','customer-replies','approval-gates']
  },
  'self-audit': {
    summary:'SmallBiz Agent has a strong local safety foundation; the next quality gains are clearer prompt feedback, test coverage, and structured skill governance.',
    findings:['UX: users need visible routing rationale after each command.','Product: business-builder templates need editable assumptions in a later phase.','Architecture: deterministic response rules should remain isolated behind one adapter.','Skill gap: there is no reviewed catalogue or version history yet.'],
    actions:['Add focused unit tests for routing and permission decisions.','Design editable report assumptions without external persistence.','Review a SkillModule catalogue before any platform-wide learning.'],
    details:['Priority 1: Routing and permission test matrix.','Priority 2: Accessible interaction drawer and keyboard focus review.','Implementation draft: add tests, document adapters, review UI, stop before commit/push/deploy.','Estimated future AI cost mode: Cheap for audit; Standard only for implementation planning.','User update summary: Improved clarity, safety, and readiness for future integrations.'],
    riskNote:'Medium context · audit is Level 0/1; any GitHub, Codex/OpenHands, merge, or deploy action would require approval or remain blocked.',
    futureIntegrationNote:'A future approved GitHub/Codex adapter could create a scoped implementation task. Auto-merge, deploy, and production edits remain Level 3.', tags:['self-audit','improvement-plan','cheap-mode','skill-gap']
  },
  daily: {
    summary:'Three founder priorities stand out today: validate the next-action concept, tighten launch positioning, and close two admin uncertainties.',
    findings:['Product feedback is converging around the gap between insight and execution.','Two launch decisions are waiting on lightweight customer evidence.','The invoice queue contains uncertainty, but no item requires an immediate financial action.'],
    actions:['Book three 20-minute customer conversations.','Choose one launch message to test before rewriting the full campaign.','Review the two uncertain invoice records without reconciling or paying them.'],
    details:['Top priority: Validate the next-action concept with three users.','Decision needed: Choose the smallest useful validation experiment.','Watch item: Protect a two-hour maker block this afternoon.'],
    riskNote:'Low risk · briefing is read-only and based entirely on illustrative local data.',
    futureIntegrationNote:'A future Gmail, calendar, Supabase, and task-system integration could gather live signals after explicit permission.', tags:['daily','planning','founder-ops']
  },
  weekly: {
    summary:'The week produced a clearer product thesis; next week should favour customer evidence over broader implementation.',
    findings:['Win: The product hypothesis is narrower and easier to test.','Blocker: Two roadmap decisions lack direct customer evidence.','Capacity signal: One prototype test and five conversations fit the available week.'],
    actions:['Schedule five targeted conversations.','Run one next-action prototype test.','Draft one launch narrative and defer integrations until workflow value is proven.'],
    details:['Founder decision: Keep external integrations out of scope.','Success measure: At least three users independently describe the same execution gap.','Review point: Friday afternoon planning checkpoint.'],
    riskNote:'Low risk · planning recommendation only; no calendar, task, or project data was changed.',
    futureIntegrationNote:'A future calendar, task manager, and Supabase connection could assemble progress signals and draft a weekly plan.', tags:['weekly','planning','review']
  },
  vexis: {
    summary:'Users value reflection but need a clearer bridge into action; a lightweight next-action commitment is the strongest roadmap candidate.',
    findings:['Feedback summary: Users want a faster path from reflection to a concrete next step.','User pain: Valuable insights can remain disconnected from execution.','Product insight: A small commitment interaction may create momentum without adding dashboard weight.'],
    actions:['Validate the concept with five users before implementation.','Prototype an editable next-action card with local persistence.','Review the GitHub issue draft before any future issue creation.'],
    details:['Roadmap item: Guided next-action capture after each VEXIS reflection.','Priority: High — evidence gathering first.','GitHub issue draft: Add an accessible next-action card with editable commitment, empty state, local persistence, and analytics placeholders.'],
    riskNote:'Medium risk · the roadmap recommendation is local; the GitHub issue remains an unsubmitted draft requiring approval.',
    futureIntegrationNote:'A future GitHub integration could create the reviewed issue only after Level 2 approval.', tags:['vexis','product','roadmap','github-draft']
  },
  marketing: {
    summary:'A direct, low-hype post positions VEXIS as a bridge from honest reflection to focused action.',
    findings:['Hook: Your best operating system might start with one honest question.','Tone: Direct, thoughtful, and grounded; avoids unsupported product claims.','Audience fit: Solo founders who feel over-served by dashboards and under-supported in decision-making.'],
    actions:['Check the language against Pol’s current brand voice.','Confirm the call to action matches the campaign goal.','Approve explicitly before any future public publishing.'],
    details:['Draft post: Most founders do not need more dashboards. They need a clearer way to notice what matters, choose the next move, and follow through. That is the idea behind VEXIS.','Short version: Less dashboard. More clarity, choice, and follow-through.','CTA: What helps you turn insight into action?','Tone notes: Calm confidence; no inflated transformation claims.'],
    riskNote:'Medium risk · brand tone and public publishing require review. Nothing was posted or scheduled.',
    futureIntegrationNote:'A future social or scheduling integration could publish only the explicitly approved version.', tags:['marketing','draft','vexis','brand-review']
  },
  github: {
    summary:'The feature is scoped as an accessible, locally persisted next-action card with targeted tests and explicit non-goals.',
    findings:['Objective: Add a focused next-action card after a completed reflection.','Context: Users need a bridge between insight and execution.','Scope can remain client-side and behind a feature flag.'],
    actions:['Confirm the acceptance criteria with the product owner.','Paste the reviewed prompt into the selected coding agent.','Review code and tests before merging or deploying.'],
    details:['Implementation instructions: Create an accessible card, editable action text, local persistence, empty state, and feature flag.','Tests: Rendering, editing, persistence, keyboard navigation, and empty state.','Guardrails: No network requests; preserve existing data; do not expose secrets; do not deploy.','Ready-to-paste Codex/OpenHands prompt: Implement the scoped next-action card using existing project conventions. Run targeted tests, report changed files, and stop before commit, push, or deployment.'],
    riskNote:'Medium risk · this is a coding prompt draft. It did not modify a repository or create a GitHub issue.',
    futureIntegrationNote:'A future GitHub and Codex/OpenHands adapter could create an approved issue or hand off this prompt with repository-scoped permissions.', tags:['engineering','github-draft','coding-prompt','tests']
  },
  invoice: {
    summary:'Twelve mock invoices were reviewed: eight possible matches and four unresolved items need human verification.',
    findings:['Invoices reviewed: 12.','Possible matches: 8.','Unmatched items: INV-1042, INV-1051, INV-1055, INV-1058.','Confidence score: 72% overall; INV-1042 is the least certain.'],
    actions:['Compare the four unmatched items with source documents.','Ask the accountant whether partial payments should remain unmatched.','Confirm supplier references for INV-1042 before recording any decision.'],
    details:['Accountant questions: Is INV-1042 a split payment? Should credit note CN-88 offset INV-1051? Is VAT treatment confirmed for INV-1058?','Approval-needed items: Review the possible INV-1042 match and the four-item exception summary.','Hard boundary: This assistant does not reconcile bank transactions, make payments, submit tax documents, or make final accounting, legal, or tax decisions.'],
    riskNote:'High risk · financial review requires human approval. All records are fictional and no accounting action occurred.',
    futureIntegrationNote:'A future read-only Xero integration could retrieve invoice data; any draft action would require server-side controls and explicit approval.', tags:['finance','invoice-review','high-risk','accountant-review']
  },
  research: {
    summary:'Trust in an AI company operator depends on visible boundaries, reversible actions, source clarity, and useful human checkpoints.',
    findings:['Clear permission levels make capability limits legible.','Approval gates are most useful when they explain the exact future action.','Structured outputs build more trust than vague conversational assurances.','Reversibility and audit history matter before connecting live systems.'],
    actions:['Test permission language with five founders.','Measure whether the result state makes local simulation obvious.','Validate approval usefulness before adding any integration.'],
    details:['Research question: What makes an AI operator trustworthy for a solo founder?','Evidence basis: Illustrative mock findings only; no live web or database research occurred.','Recommendation: Prioritise transparent controls before expanding autonomy.'],
    riskNote:'Low risk · mock research with no live sources; findings should not be treated as validated evidence.',
    futureIntegrationNote:'A future research adapter could gather cited sources through approved providers and preserve provenance in the report.', tags:['research','trust','operator-design','mock-evidence']
  }
}

const personalisedWorkflows = new Set(['business-plan','funding','automation','self-audit','marketing','research'])
function profileSection(profile?:BusinessProfile,workflowId?:string):string {
  if(!profile)return ''
  const tailored=personalisedWorkflows.has(workflowId||'')?`\nPERSONALISATION NOTE\nRecommendations are framed for ${profile.businessName}'s ${profile.productOrService}, serving ${profile.targetCustomer}. The current goal is “${profile.currentGoal}” and the main constraint is “${profile.biggestChallenge}”. Use a ${profile.preferredTone} tone and ${profile.riskComfort} risk posture.\n`:''
  return `BUSINESS CONTEXT USED\nBusiness: ${profile.businessName}\nStage: ${profile.stage}\nIndustry: ${profile.industry}\nCurrent goal: ${profile.currentGoal}\nBudget level: ${profile.budgetLevel}\n${tailored}\n`
}

function formatReport(template: MockReportTemplate, approvalNeeded: boolean, profile?:BusinessProfile, workflowId?:string): string {
  return `${profileSection(profile,workflowId)}EXECUTIVE SUMMARY\n${profile&&personalisedWorkflows.has(workflowId||'')?`For ${profile.businessName}: `:''}${template.summary}\n\nKEY FINDINGS\n${template.findings.map(item=>`• ${item}`).join('\n')}\n\nRECOMMENDED NEXT ACTIONS\n${template.actions.map((item,index)=>`${index+1}. ${item}`).join('\n')}\n\nFULL MOCK OUTPUT\n${template.details.map(item=>`• ${item}`).join('\n')}\n\nAPPROVAL / RISK NOTE\n${template.riskNote}\nApproval needed: ${approvalNeeded ? 'Yes — a local approval preview was created.' : 'No.'}\n\nFUTURE INTEGRATION NOTE\n${template.futureIntegrationNote}\nNo external action was taken.`
}

export async function runWorkflow(workflow: Workflow, approvalNeeded: boolean, profile?:BusinessProfile): Promise<AgentOutput> {
  await generateMockCompletion({ agentId:workflow.assignedAgent, prompt:workflow.name })
  const template = templates[workflow.id]
  if (!template) throw new Error('No local mock report template is available for this workflow.')
  return {
    id:crypto.randomUUID(), agentId:workflow.assignedAgent, title:`${workflow.name} · Mock report`, summary:template.summary,
    fullOutput:formatReport(template, approvalNeeded,profile,workflow.id), tags:[...template.tags, workflow.riskLevel, 'local-mock'],
    createdAt:new Date().toISOString(), usefulnessRating:null, approvalNeeded, riskNote:template.riskNote,
    futureIntegrationNote:template.futureIntegrationNote, source:workflow.id==='business-plan'||workflow.id==='funding'?'business-builder':workflow.id==='automation'?'automation-blueprint':workflow.id==='self-audit'?'self-audit':'workflow',
    permissionLevel:approvalNeeded?2:1, estimatedCostMode:'cheap',
    contextUsed:profile?{businessName:profile.businessName,stage:profile.stage,industry:profile.industry,currentGoal:profile.currentGoal,budgetLevel:profile.budgetLevel}:undefined
  }
}
