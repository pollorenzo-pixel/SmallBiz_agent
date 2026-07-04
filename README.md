# SmallBiz Agent

Official project name: `smallbiz_agent`

SmallBiz Agent is a local-first AI business-building and automation command center for solo founders and small businesses. Its long-term promise is to help a person start, plan, fund, launch, run, and automate a business with a small AI operating team. The current MVP uses deterministic mock templates only.

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
