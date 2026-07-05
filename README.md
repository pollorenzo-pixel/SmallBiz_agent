# SmallBiz Agent

Official project name: `smallbiz_agent`

SmallBiz Agent is a local-first AI business-building and automation command center for solo founders and small businesses. Its long-term promise is to help a person start, plan, fund, launch, run, and automate a business with a small AI operating team. The current MVP uses deterministic mock templates only.

## Phase 15 — Guided Builder Workflows

Phase 15 adds a beginner-friendly Builder inside each user project. It can prepare seven deterministic plans: a business website, pricing page, product offer page, launch plan, first ad campaign, app idea, or automation plan. Every run saves a project-linked report and creates practical action-board items and milestones. Website, app, ad, and automation plans also create a **simulated Level 2 approval preview** for possible future external actions; approving that preview still executes nothing.

### Test the Guided Builder

1. Complete onboarding, open **Projects**, and create or select a user-owned project.
2. Under **Build something**, run each of the seven Builder cards with blank defaults or short custom answers.
3. Confirm each result appears in Reports and remains linked to the selected project.
4. Confirm suggested tasks appear on the Action Board and suggested milestones appear in Milestones after refresh.
5. Confirm pricing, offer, and launch planning create no approval because they are harmless local drafts.
6. Confirm website, app, ad, and automation planning create only local approval previews.
7. Open the ad plan and confirm it says no Meta connection, launch, spend, card charge, or customer guarantee occurred.
8. Confirm older localStorage values still load, Level 3 remains blocked, and `npm run typecheck` plus `npm run build` pass.

The managed website direction may later use Next.js/Tailwind, a private Polsia repository, Render, a `project.polsia.app` URL, downloadable code, and custom domains. The managed ads direction may later include creative generation, monitoring, pausing, and a platform fee. Those are product ideas only: this MVP does not create repositories, push code, deploy, connect Meta, publish ads, spend money, charge cards, update databases, send outreach, or perform any external action.

Builder workflows can only plan assets belonging to the user’s own projects. They cannot modify SmallBiz Agent screens, navigation, internal logic, built-in workflows, architecture, or safety rules. All data remains defensive localStorage/mock data; Level 3 stays blocked.

## Phase 16 — Guided Builder Inputs and Results

Each Guided Builder now uses a beginner-friendly four-part flow: choose what to build, answer plain-English questions, review “Here’s what your AI team will use,” and create the plan. All seven builders have purpose-specific fields and a one-tap **I don’t know yet** option. Every blank field receives a sensible local default, so a plan can always be created without errors.

Results now explain what was created, show suggested actions and milestone counts, link to the saved report and project board, offer summary/full-plan copy buttons, and make approval previews visible when relevant. Every result states that it is planning only and that nothing was published, deployed, sent, or spent. Ad results additionally state that no ad was launched and no money was spent.

### Test Phase 16

1. Open a project and choose each of the seven cards under **Build something**.
2. Complete its plain-English form, review the answers, edit one answer, and create the plan.
3. Repeat with every field blank; confirm helpful defaults appear in the review and saved report.
4. In Reports, confirm the **Based on** section lists the inputs used.
5. Confirm actions and milestones are linked to the project and persist after refresh.
6. Confirm only website, app, ad, and automation plans create simulated approval previews.
7. At approximately 390px wide, confirm fields, review cards, result actions, and copy buttons remain comfortable to use.
8. Confirm corrupted builder-run storage safely falls back, Level 3 stays blocked, and no browser console errors appear.

Phase 16 remains deterministic and localStorage-only. It has no APIs, backend, secrets, repository creation, deployment, ad platform connection, spend, email sending, payments, or other external action.

## Phase 17 — Builder Plan Review Experience

Builder outputs now open as clean, project-linked plan documents in Saved Work. New plans store a typed, consistent structure covering the inputs used, recommended sections, next actions, milestones, future approval items, and safety note. Older Phase 15–16 builder reports use a defensive fallback view, so missing structured fields never crash the plan reader.

Each plan detail shows its title, builder type, project, date, planning-only boundary, **Based on** inputs, summary, plan sections, actions, milestones, approval previews, usefulness feedback, and plain-English copy controls. Project Workspace now includes **Plans created**, where recent plans belonging to that project can be reopened. The Builder result’s **Open plan** button goes directly to the saved plan.

### Test Phase 17

1. Run a Guided Builder and choose **Open plan** from its result.
2. Confirm the plan shows Based on, summary, recommended sections, next actions, milestones, approvals, and safety language.
3. Test Copy summary, Copy full plan, Copy next actions, and an individual section copy button.
4. Return to Projects and open the same plan from **Plans created**.
5. Open an older builder report without `builderPlan`; confirm the fallback document remains readable.
6. Open an ad campaign plan and confirm it says no ad was launched, no money was spent, and it is a campaign plan only.
7. At approximately 390px wide, confirm long sections wrap and all buttons remain easy to tap.
8. Refresh and confirm plans, actions, milestones, approval previews, and feedback persist locally.

Phase 17 is display, review, and copy only. It performs no deployment, repository creation, publishing, messaging, ad launch, spending, payment, backend request, API call, or Level 3 action.

## Phase 6.5 — Simple Human-Friendly UI Refresh

Phase 6.5 makes the app calmer and easier for non-technical users while preserving the existing local architecture. Navigation now uses **Home**, **Your AI Team**, **Help Menu**, **Needs Review**, and **Saved Work**. Home leads with one clear question, six familiar quick actions, review status, recent work, and today’s priorities. Agent and task cards use plain language, larger touch targets, shorter descriptions, and progressive disclosure for technical details.

The design principles are simple: lead with the user’s goal, use everyday words, keep one obvious next action, reveal detail only when requested, and clearly explain that important work waits for review. Provider, ability, safety, and execution information still exists for auditing and future backend work, but is labelled as advanced or shown under **How this was prepared** instead of dominating the main experience.

### Test the simplified experience

1. Open at mobile width and complete onboarding; confirm the form and primary action remain comfortable to tap.
2. Confirm Home begins with “What do you need help with today?” and the six plain-English quick actions.
3. Use a quick action and confirm the same local workflow/report behavior still works.
4. Open **Your AI Team** and confirm cards explain what each member helps with and offer a clear Ask button.
5. Open **Help Menu**, start a task, and confirm advanced ability/safety details are collapsed by default.
6. Confirm completed work appears in **Saved Work** and Level 2 suggestions appear in **Needs Review**.
7. Approve, edit, and reject a suggestion; confirm only local status changes.
8. Open Settings and confirm personal details appear before technical architecture information.
9. Run `npm run build`, refresh, and confirm profiles, saved work, reviews, execution logs, and preferences persist.

This phase changes presentation only. Mock providers, local abilities, execution records, permission gates, Level 3 blocking, PWA behavior, and defensive localStorage services remain unchanged. No real API, secret, AI token, payment, message, repository, or production action is introduced.

## Phase 4 — Onboarding and Business Profile Memory

First-time users now complete a mobile-first onboarding flow before reaching the dashboard. The local `BusinessProfile` records founder and business names, stage, industry, offer, customer, current goal, biggest challenge, budget, tone, risk comfort, and desired future integrations.

The profile personalises the Command Center, prompt responses, and workflow reports. Reports expose a `contextUsed` panel so users can see exactly which business name, stage, industry, goal, and budget influenced the mock output.

### Test onboarding and memory

1. Open the app on a fresh origin or clear the `smallbiz.businessProfile` localStorage key.
2. Confirm onboarding appears before the dashboard.
3. Complete all required fields and submit; confirm the personalised dashboard appears.
4. Refresh and confirm the profile persists.
5. Run Business Plan, Funding, Automation, Self-Audit, Marketing, and Research workflows; expand their reports and confirm profile context appears.
6. Open **Settings → Business Profile**, edit a field, save, and confirm the dashboard/report context uses the update.
7. Preview the readable export or export JSON.
8. Choose **Clear profile & restart onboarding**, confirm the warning, and verify onboarding returns. Existing reports and approvals are intentionally retained.

Profile memory is local-only in the MVP: there is no cloud sync, authentication, or secret storage. Corrupted profile JSON is removed safely and returns the user to onboarding. A future Supabase/Postgres implementation must preserve the profile-service interface while adding authentication, Row Level Security, server-side validation, audit controls, and scoped data deletion.

## Phase 5 — Personalised Operator Layer

Phase 5 adds a typed local `FounderProfile` alongside onboarding’s `BusinessProfile`. The founder profile stores operator name, company, main projects, stage, current priorities, tone, risk preference, and default permission level. Existing onboarding data seeds it automatically; both profile services are isolated for a future authenticated Supabase/Postgres migration.

The Home screen now ranks workflows using projects, stage, priorities, tone, risk, and permission preference. Mock workflow and direct-agent outputs receive the same context while preserving workflow risk rules. For example, a VEXIS/product-validation profile raises VEXIS Feedback, Research, Marketing, and GitHub task work.

Reports now support search, agent and tag filters, detail expansion, summary/full-output copying, and usefulness ratings. Approvals include an editable local action, payload preview, required rejection reason, decision timestamps, and visible Level 2/3 warnings. No approval executes external work.

### Phase 5 test steps

1. Complete onboarding or refresh an existing Phase 4 profile; confirm a FounderProfile is created and persists.
2. In Settings, add projects such as `VEXIS`, priorities such as `product validation`, choose tone/risk/default permission, and save.
3. Return Home and confirm recommended workflows and current priorities update.
4. Run a recommended workflow and confirm the full output references projects, priorities, stage, tone, or permission context relevant to its agent.
5. In Reports, test text search, agent filter, tag filter, Copy summary, Copy full output, and Useful/Not useful.
6. Create a Level 2 local approval, open its detail, edit the action, then test approval and rejection (rejection requires a reason).
7. Submit a Level 3 request and confirm it remains blocked with no executable approval.
8. Refresh and confirm profiles, reports, ratings, approvals, edits, reasons, and timestamps persist locally.

All Phase 5 behaviour is deterministic and browser-local. No API, AI token, secret, payment, database, email, repository, or production action is used.

## Backend-ready mock provider and tool execution architecture

This phase adds frontend-only interfaces and registries for future providers, tools, execution requests/results, permission gates, and audit logs. Existing workflows now run through `executionEngine.ts` before the deterministic report generator:

1. Resolve workflow and assigned agent.
2. Select the enabled Mock Local Provider.
3. Resolve workflow tool definitions from the Tool Registry.
4. Build a typed `ExecutionRequest` with local profile context.
5. Evaluate Level 0–3 permissions.
6. Simulate only enabled Level 0/1 tools and persist `ToolExecutionLog` records.
7. For Level 2, run safe draft tools and create a local approval preview for the sensitive future action.
8. For Level 3, create a blocked `ExecutionResult`; no report, approval, tool execution, or external action occurs.
9. Generate the existing structured report, attach provider/tool metadata, and persist the `ExecutionResult`.

### AI Provider Registry

`src/services/ai/providers.ts` defines Mock Local, future OpenAI-compatible, future OpenClaw, and future local-model providers. Only Mock Local is enabled. The selected provider ID is stored locally, but disabled providers cannot be selected or executed.

Future real providers must be implemented behind a backend adapter with environment-managed credentials, scoped permissions, rate/cost controls, audit logs, and approval enforcement. Production API keys must never be placed in frontend code or localStorage because browser users and injected scripts can read them.

### Tool Registry

`src/services/tools/toolRegistry.ts` describes mock analysis/draft tools and disabled future Gmail, GitHub, Xero, Supabase, and webhook tools. Each tool declares its schema descriptions, permission, risk, approval requirement, enabled state, and future integration boundary. `mockToolExecutor.ts` never performs network or external work.

### Local execution storage

Execution results and tool logs use defensive localStorage helpers under `smallbiz.executionResults` and `smallbiz.toolExecutionLogs`. Settings shows local run/log counts, providers, and tools. Corrupted arrays fall back safely. These records are local diagnostics, not proof that any real-world action happened.

### Architecture testing

1. Run Daily Business Briefing and confirm three tools are simulated with Mock Local Provider and no approval.
2. Run VEXIS, Marketing, GitHub, Automation, Self-Audit, or Invoice workflow and confirm safe tools run plus a local Level 2 approval preview.
3. Expand its report and inspect provider, tools, permission decision, approval status, and execution-result ID.
4. Open Settings and confirm only Mock Local is enabled; all future providers are disabled.
5. Inspect Tool Registry permission/risk badges and disabled future tools.
6. Refresh and confirm reports, approvals, execution results, selected provider, and tool logs persist.
7. Submit a Level 3 command and confirm it remains blocked without creating an executable approval.
8. Run `npm run build` and audit source for network clients or secret files.

This architecture remains deterministic and mock-only. It contains no OpenAI, GitHub, Gmail, Xero, Supabase, Slack, webhook, MCP, payment, tax, deletion, or production API client.

## Repository Boundary

- This is the standalone app repository for SmallBiz Agent.
- Intended GitHub repository: `pollorenzo-pixel/SmallBiz_agent`.
- Official project name: `smallbiz_agent`; npm package name: `smallbiz-agent`.
- This is not the VEXIS repository. VEXIS is a future managed project inside SmallBiz Agent.
- No real APIs are connected and all current data is mock/local.
- Future integrations must use backend/environment secrets, server-side permissions, audit logs, and approval gates.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` for a production build and `npm run preview` to serve it.

## Business Builder Mode

The Command Center accepts natural-language prompts and routes them deterministically to a relevant local agent or workflow. Try:

- `Where do we start building?`
- `Build me a business plan for my idea.`
- `Create a detailed financial forecast.`
- `Find ways to fund this with no starting capital.`
- `Create a 30-day launch plan.`

Responses are structured mock reports saved in localStorage. Business plans and forecast placeholders are Level 1 drafts and do not create approvals unless the prompt proposes a future Level 2 action.

## Phase 3 workflows

### Business Plan Builder

Creates an executive summary, one-page plan, full plan outline, customer and offer assumptions, basic 12-month forecast placeholder, startup costs, funding options, go-to-market plan, first 30 days, risks, and next actions. Editable Excel export is planned for a later backend/local-generation phase.

### Low-Capital Funding Strategy

Separates must-have and delayable costs, then suggests bootstrapping, pre-sale, partnership, grant/loan/investor placeholders, and first-revenue experiments. It does not guarantee funding or provide final financial advice.

### Automation Blueprint Builder

Maps a manual process into triggers, actions, tools, approval gates, an implementation sequence, and testing checklist. It creates only a blueprint and local approval preview—never a real automation.

### Self-Audit & Improvement Plan

The Self-Improvement Agent reviews mock/static app status and drafts product, UX, architecture, testing, release-note, and skill recommendations. It cannot edit code, create PRs, merge, deploy, or run in the background.

## Skill Learning Loop

Prompts such as `Teach yourself how to automate restaurant bookings` create a local Skill Gap Report. The report records the requested capability, detected gap, proposed skill, required inputs, workflow, risk, permission level, and review requirements. A local approval preview is created because future platform-wide learning is Level 2.

The MVP never self-modifies, installs skills globally, changes platform settings, creates pull requests, or runs autonomous learning.

## AI cost and autonomy guardrails

Settings shows local placeholders for monthly budget, future Cheap/Standard/Premium modes, premium and external-agent approvals, background-run blocking, self-audit-only behaviour, skill review, and production/irreversible-action blocking.

Every response currently costs **0 real tokens**. No billing or model provider is connected. Background self-improvement and autonomous learning loops are blocked.

## Command routing and direct agent interaction

The local response engine recognises business planning, forecasts, research, funding, launches, marketing, product, coding, finance/admin, customer replies, automation, self-audit, skill learning, and restricted actions. It returns deterministic structured data through a replaceable service boundary.

On **Agents**, choose **Ask this agent**, select an example or type a prompt, and generate a local response in that specialist’s style. Successful responses are saved to Reports; Level 2 proposals create local approvals; Level 3 requests show a blocked result and are not saved as executable work.

## Verification checklist

1. Submit `Where do we start building?` and confirm a report appears immediately and persists in **Reports**.
2. Run **Business Plan Builder**, **Low-Capital Funding Strategy**, **Automation Blueprint Builder**, and **Self-Audit & Improvement Plan**.
3. Ask any agent directly and confirm its report source is `direct-agent`.
4. Submit `Teach yourself how to manage staff rota planning` and confirm a Skill Gap Report plus local approval preview.
5. Submit `Make a payment and auto-deploy this` and confirm a Level 3 blocked state with no executable approval.
6. Approve/reject/edit a local approval and refresh to confirm persistence.
7. Confirm existing Phase 1/2 workflows still run and create their structured reports.
8. Run `npm run build`.

## Permission model

- **Level 0 — Read-only:** summaries, analysis, recommendations, and research placeholders.
- **Level 1 — Draft action:** business plans, forecasts, funding drafts, email/issue drafts, invoice reviews, blueprints, skill drafts, release notes, and implementation plans.
- **Level 2 — Approval required:** future sending, publishing, database updates, APIs/workflows, funding submissions, external coding agents, and platform-wide skills.
- **Level 3 — Restricted:** payments, reconciliation, tax, production deletion, commitments, irreversible actions, auto-merge/deploy, autonomous production changes, unreviewed skill installation, and unapproved token spend.

Level 3 is always blocked in the MVP. Approval buttons only update local browser state.

## Future integration boundaries

- `src/services/modelAdapter.ts`: future OpenAI-compatible provider boundary.
- `src/services/mockAgentResponse.ts`: current deterministic router/response engine.
- `src/services/workflowRunner.ts`: workflow execution boundary.
- `src/services/approvalService.ts`: approval policy boundary.
- `src/services/integrationRegistry.ts`: future integration registry.
- `src/integrations/futureAdapters.ts`: disabled GitHub, Gmail, Xero, Supabase, Codex/OpenHands, orchestration, and webhook placeholders.

Potential future systems include OpenAI-compatible APIs, GitHub, Gmail, Xero, Supabase, Slack, Discord, Telegram, OpenClaw, Sim, Codex/OpenHands, webhooks, MCP servers, Companies House/HMRC/Stripe where legally appropriate, and backend/local Excel generation.

No real API, AI model, token spend, external action, secret storage, code modification, repository action, message, payment, submission, or automation occurs in this MVP.

## Phase 7 — Simple onboarding and personalised AI team

First-time users now complete a six-step, mobile-first setup covering their name, business, goals, projects, tone, and preferred help level. The typed founder profile is stored defensively in localStorage and marks onboarding as complete. Home quick actions, current focus, AI Team ordering, Help Menu recommendations, and local mock output context respond to those answers.

To test Phase 7: clear the setup from **Settings → Your setup**, complete all six steps, refresh to confirm persistence, then compare recommendations after changing goals. Run a recommended workflow and confirm its report and any review item remain local. At 390×844, verify every step, Back/Next, goal selection, navigation, and setup reset remain usable.

The setup has no cloud sync and must not contain passwords or secrets. Resetting setup returns to onboarding while preserving saved work and review history. A future Supabase migration must add authentication, Row Level Security, server validation, and audit controls before storing profile data remotely.

## Phase 8 — Smart Command Input and guided workflow router

Home now lets a user describe what they need in plain English. A local keyword router recommends the best helper and workflow, explains why it fits, previews the result, and shows the safety boundary before anything runs. Users can run the suggestion, edit their request, or select another workflow. Recent requests are stored only in `smallbiz_command_history` in localStorage.

Supported examples include planning a week, turning feedback into tasks, writing a founder post, preparing a coding prompt, reviewing invoices, comparing competitors or tools, and drafting a customer reply. Unknown requests fall back to Founder Ops and a simple priorities workflow instead of blocking the user.

To test: enter `write a founder post`, `prepare a coding prompt`, and `review invoices`; confirm the Marketing, Engineering, and Finance/Admin routes respectively. Try an unclear request and confirm the helpful fallback. Run both a low-risk and approval-required suggestion, then check Saved Work and Needs Review. Refresh and confirm recent requests persist. All routing, execution, reports, history, and approvals remain mock/local. No AI API, network request, secret, or external action is used.

## Phase 9 — Better reports and simple result review

Workflow results now open with a plain-English review showing what happened, key findings, next steps, reusable copy, and any approval requirement. Saved Work uses cleaner cards and a focused report view with copy buttons and locally stored Helpful / Not helpful feedback. New reports include backward-compatible structured fields while older localStorage reports use safe summary and full-output fallbacks.

Marketing drafts, GitHub issue/Codex prompts, product issue drafts, accountant questions, research summaries, and general action plans expose a ready-to-copy block. Approval explanations say exactly why a review item exists and confirm that nothing was sent or changed. Level 3 actions remain blocked.

To test Phase 9: run Daily Briefing and Weekly Planning, then run Marketing, VEXIS, GitHub, Invoice, and Research workflows. Check the post-run summary, copy confirmation, full report view, usefulness rating persistence, and approval explanation. Refresh to verify reports and ratings persist. No live sources, APIs, payments, reconciliation, tax submission, publishing, or external tool actions are connected.

## Phase 10 — Approval flow polish

Needs Review now uses clear, mobile-friendly cards and a guided approval view. Each item explains the proposed action, why review is required, risk and confidence in plain English, what local approval means, and everything the app will not do automatically. Users can edit a proposal with Save/Cancel, reject with or without a note, or approve locally. Status history includes safe fallbacks for older approvals plus new updated, approved, and rejected timestamps.

To test: run Marketing, GitHub, Automation, or Invoice workflows to create review items. Open an approval, save an edit, cancel another edit, reject one with and one without a reason, and approve one. Refresh after each decision to confirm local persistence. Submit a Level 3 request and confirm it remains blocked; restricted items cannot be approved and instead suggest preparing a draft, checklist, or professional-review summary.

Approval buttons only update localStorage. They never send email, create GitHub issues, update databases, trigger workflows, reconcile transactions, make payments, submit tax documents, delete production data, or create legal/financial commitments. No backend, API, secret, or external integration is connected.

## Phase 11: Project Workspace Foundation

Phase 11 adds a local Project Workspace for user-owned business work. It helps founders keep business ideas, website/app plans, launch tasks, notes, saved reports, and approval-linked work in one simple command-center area.

What it supports in local demo mode:

- Create and edit a project in the browser.
- Track project type, stage, status, priority, owner goal, and description.
- Add notes and next actions.
- Mark next actions done or not done.
- Link existing saved reports to a project.
- See related approval items when they are connected through saved work.
- Preview active workspace activity from Home.

Boundary reminder: the workspace is for the user's own business projects and outputs. It does not allow users to change the SmallBiz Agent / AI Company Operator platform itself.

Storage and safety:

- Projects are saved only to `localStorage` under `operator.projects`.
- Corrupted project storage falls back safely to an empty workspace.

## Phase 12: Workspace-to-AI Team Flow

Open a user-owned project in Workspace and choose **Ask the AI Team** to plan next steps, create product tasks or marketing copy, prepare a coding prompt, research options, or review admin/finance notes. Deterministic local helpers select the relevant built-in teammate, generate a structured mock report, save it to Saved Work, and link the report back to the project. Sensitive drafts such as GitHub issues, coding handoffs, or accountant emails create a local approval item instead of contacting an external service.

To test locally: create or open a project, run each help action, confirm the result appears on the project, then open and copy it in Saved Work. Check that linked reports and approvals remain after refresh. Product tasks use Engineering for Website/App projects and Product otherwise. Finance review never reconciles transactions, pays, submits tax documents, or gives final accounting, legal, or tax advice.

Everything remains mock/localStorage only. No API, secret, backend, hidden automation, or external action is connected. Level 3 payments, reconciliation, tax submission, production deletion, commitments, and irreversible actions remain blocked. Workspace tools only operate on the user’s own projects and assets; they cannot modify the SmallBiz Agent platform, its screens, workflows, safety rules, internal logic, or architecture.

## Phase 13: Project Action Board and milestones

Each user-owned Workspace project now has a simple Action Board with **Next actions**, **In progress**, **Stuck**, and **Done** sections. Actions can be added, edited, prioritised, linked to a milestone, moved with buttons, marked complete, or deleted. Milestones can be planned, made active, completed, and reopened. Board data is stored defensively in localStorage under `operator.projectActions` and `operator.projectMilestones`, so older saved projects continue with empty board defaults.

After an AI Team project-help report is created, choose **Add suggested actions to board**. Only missing actions are added and they retain a link to the source report. Saved Work shows when a report has created board actions. Home displays lightweight open, stuck, done, and next-action signals.

To test: open a project, add a milestone and action, move the action through each status, edit its title/description/priority, link it to the milestone, and mark both complete. Generate a Phase 12 project report and add its suggested actions twice to confirm duplicates are prevented. Refresh to confirm persistence. No API, backend, secret, external workflow, or real action is connected; Level 3 stays blocked, and the board cannot modify SmallBiz Agent core platform files or behavior.

## Phase 14: Founder Focus daily operating loop

Home now opens with **Today’s Focus**, derived locally from active projects, action priorities, stuck work, milestones, pending approvals, and useful/recent reports. Founders can switch the focus project, see three recommended priorities, mark the next action done, ask the suggested teammate, or generate a project-aware Daily Business Briefing. Empty states guide first-time users toward creating a project, actions, milestones, approvals, and reports.

Daily Business Briefing reports now include project progress, priority actions, blockers, approval status, the next AI Team action, and an end-of-day prompt. The local End-of-day Review records completed work, blockers, tomorrow’s work, and a note for Founder Ops as a report linked to the chosen project.

To test: try fresh localStorage, a project with no actions, and a project with high/blocked/completed actions plus milestones and approvals. Switch the focus project, mark an action done, run Daily Briefing, save an end-of-day review, refresh, and confirm reports/action state persist. All recommendations and drafts remain local/mock. The AI Team cannot publish, spend, advertise, email, create external issues, or change outside systems; Level 2 requires review and Level 3 remains blocked. Workspace features cannot modify the SmallBiz Agent core platform.
- No backend, Supabase, external API, secret storage, or real integration is introduced.
- Existing approval safety levels remain unchanged; Level 3 restricted actions stay blocked in the MVP.

Validation for this phase:

```bash
npm run typecheck
npm run build
```
