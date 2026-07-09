import { Badge } from './Badge'
const levels = [
  ['Level 0','Notices and organises','Read, summarise, classify, organise, and use your local setup.'],
  ['Level 1','Prepares the work','Prepare drafts, plans, recommendations, and next steps for you.'],
  ['Level 2','You approve first','Approval is required before sending, creating, updating, or triggering any external action.'],
  ['Level 3','Blocked in MVP','Payments, tax submissions, deletion, commitments, deployment, and irreversible changes are blocked.']
]
export function PermissionGuide() { return <div className="permission-grid">{levels.map(([level,title,text],i)=><div className={`permission level-${i}`} key={level}><Badge tone={i === 3 ? 'restricted' : i === 2 ? 'warning' : 'neutral'}>{level}</Badge><div><strong>{title}</strong><p>{text}</p></div>{i===3 && <span className="blocked">Blocked in MVP</span>}</div>)}</div> }
