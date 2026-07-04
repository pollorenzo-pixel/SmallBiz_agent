import type { Integration } from '../types'

export const integrations: Integration[] = ['OpenAI-compatible','GitHub','Gmail','Xero','Supabase','Slack','Discord','Telegram','Webhooks','MCP servers','Codex/OpenHands','Sim/OpenClaw','Excel export'].map((name, i) => ({
  id:name.toLowerCase().replace(' ','-'), name, status:'placeholder', description:`Future ${name} connection. No data or actions in this MVP.`, authType:i < 4 ? 'OAuth / server secret' : 'Token / server secret', permissions:[0,1,2], riskLevel:i === 2 ? 'high' : 'medium'
}))
