// Deliberately non-functional Phase 2 boundaries. Real adapters must live behind
// backend authentication, server-side permission checks, audit logs, and approvals.
export const futureAdapters = {
  githubIntegration: 'GitHub issue and repository previews',
  gmailIntegration: 'Gmail read signals and email drafts',
  xeroIntegration: 'Read-only Xero invoice retrieval',
  supabaseIntegration: 'Supabase business context and persistence',
  codingAgentAdapter: 'Codex/OpenHands task hand-off',
  orchestrationAdapter: 'Sim/OpenClaw-style orchestration and webhooks'
} as const

export function invokeFutureAdapter(): never {
  throw new Error('Future integrations are disabled. No external service was contacted.')
}
