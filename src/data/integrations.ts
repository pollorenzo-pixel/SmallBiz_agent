import type { Integration } from '../types'

const integrationSeed:Array<Pick<Integration,'name'|'description'|'authType'|'riskLevel'>>=[
 {name:'OpenAI-compatible',description:'Backend/serverless AI provider foundation. Mock fallback remains active without server env vars.',authType:'Backend env var',riskLevel:'medium'},
 {name:'Gmail',description:'Coming Phase 23: read mail, create reports, extract actions, and draft replies for approval before sending.',authType:'OAuth / server secret',riskLevel:'high'},
 {name:'Google Calendar',description:'Coming Phase 24: read availability, suggest slots, and prepare event drafts for approval before creation.',authType:'OAuth / server secret',riskLevel:'high'},
 {name:'Xero',description:'Future read-only finance/admin support. No payments, reconciliation, tax submissions, or accounting decisions.',authType:'OAuth / server secret',riskLevel:'high'},
 {name:'GitHub',description:'Future issue or prompt handoff only after approval. No deploys, merges, or external coding agents in the MVP.',authType:'OAuth / server secret',riskLevel:'medium'},
 {name:'Supabase',description:'Future authenticated storage with RLS and server-side controls.',authType:'Token / server secret',riskLevel:'medium'},
 {name:'Slack',description:'Future messaging summaries and drafts. No sending without approval.',authType:'Token / server secret',riskLevel:'medium'},
 {name:'Webhooks',description:'Future inbound/outbound automation hooks behind approval gates.',authType:'Token / server secret',riskLevel:'medium'},
 {name:'MCP servers',description:'Future tool access through permission gates and audit logs.',authType:'Token / server secret',riskLevel:'medium'},
 {name:'Excel export',description:'Future local/exportable reports and forecasts.',authType:'None / local export',riskLevel:'medium'}
]

export const integrations: Integration[]=integrationSeed.map(item=>({
 id:item.name.toLowerCase().replaceAll(' ','-'),
 name:item.name,
 status:'placeholder',
 description:item.description,
 authType:item.authType,
 permissions:[0,1,2],
 riskLevel:item.riskLevel
}))
