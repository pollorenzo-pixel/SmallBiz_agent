import type { Integration } from '../types'
import { appMode } from '../config/appMode'

const integrationSeed:Array<Pick<Integration,'name'|'description'|'authType'|'riskLevel'>>=[
 {name:'OpenAI-compatible',description:'Backend/serverless AI provider foundation. Mock fallback remains active without server env vars.',authType:'Backend env var',riskLevel:'medium'},
 {name:'Gmail',description:appMode.allowsDemoData?'Prototype data only / backend-ready. Prototype mode reviews sample mail, creates reports, extracts actions, and drafts replies for approval before any future send.':'Backend-ready / not connected. No real Gmail account is connected; production-preview starts without sample inbox data.',authType:'Future OAuth / server secret',riskLevel:'high'},
 {name:'Google Calendar',description:appMode.allowsDemoData?'Prototype data only / backend-ready. Prototype mode reviews sample calendar events, prepares meeting briefings, and queues event action approvals before any future create/update/invite/send.':'Backend-ready / not connected. No real Google Calendar account is connected; production-preview starts without sample event data.',authType:'Future OAuth / server secret',riskLevel:'high'},
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
 status:item.name==='Gmail'||item.name==='Google Calendar'?'mock-connected':'placeholder',
 description:item.description,
 authType:item.authType,
 permissions:[0,1,2],
 riskLevel:item.riskLevel
}))
