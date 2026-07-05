import { Badge } from './Badge'
const levels = [
  ['Level 0','Safe to do now','Read, organise, summarise, recommend, and use your local setup.'],
  ['Level 1','Creates a draft','Prepares plans, messages, blueprints, issues, and next steps for you.'],
  ['Level 2','Needs your review first','Anything that could later send, publish, update data, or involve another service waits for you.'],
  ['Level 3','Unavailable','Payments, tax submissions, deletion, commitments, deployment, and irreversible changes are blocked.']
]
export function PermissionGuide() { return <div className="permission-grid">{levels.map(([level,title,text],i)=><div className={`permission level-${i}`} key={level}><Badge tone={i === 3 ? 'restricted' : i === 2 ? 'warning' : 'neutral'}>{level}</Badge><div><strong>{title}</strong><p>{text}</p></div>{i===3 && <span className="blocked">Blocked in MVP</span>}</div>)}</div> }
