import { Badge } from './Badge'
const levels = [
  ['Level 0','Read-only','Summarise, analyse, recommend, and produce research placeholders.'],
  ['Level 1','Draft action','Business plans, forecasts, blueprints, skill drafts, emails, issues, and implementation plans.'],
  ['Level 2','Approval required','Future sending, publishing, database updates, external agents, automations, applications, and platform-wide skills.'],
  ['Level 3','Restricted','Blocked: payments, reconciliation, tax, deletion, commitments, auto-merge/deploy, autonomous production changes, and unapproved token spend.']
]
export function PermissionGuide() { return <div className="permission-grid">{levels.map(([level,title,text],i)=><div className={`permission level-${i}`} key={level}><Badge tone={i === 3 ? 'restricted' : i === 2 ? 'warning' : 'neutral'}>{level}</Badge><div><strong>{title}</strong><p>{text}</p></div>{i===3 && <span className="blocked">Blocked in MVP</span>}</div>)}</div> }
