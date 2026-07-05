import type { ReactNode } from 'react'

export type PageId = 'home'|'workspace'|'agents'|'workflows'|'approvals'|'reports'|'settings'
const nav: {id:PageId; label:string; icon:string}[] = [
  {id:'home',label:'Home',icon:'⌂'},{id:'workspace',label:'Workspace',icon:'▦'},{id:'agents',label:'AI Team',icon:'◎'},{id:'workflows',label:'Help Menu',icon:'↗'},
  {id:'approvals',label:'Review',icon:'✓'},{id:'reports',label:'Saved Work',icon:'▤'},{id:'settings',label:'Settings',icon:'⚙'}
]
export function Shell({ page, setPage, pending, children }:{page:PageId; setPage:(p:PageId)=>void; pending:number; children:ReactNode}) {
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={()=>setPage('home')}><span className="brand-mark">S</span><span><b>SmallBiz Agent</b><small>Build · launch · automate</small></span></button>
      <nav>{nav.map(item=><button key={item.id} className={page===item.id?'active':''} onClick={()=>setPage(item.id)}><span>{item.icon}</span><em>{item.label}</em>{item.id==='approvals'&&pending>0&&<i>{pending}</i>}</button>)}</nav>
      <div className="local-mode"><span className="pulse"/><div><b>Local demo mode</b><small>Nothing is sent</small></div></div>
    </aside>
    <main>{children}</main>
    <nav className="mobile-nav">{nav.map(item=><button key={item.id} aria-label={item.label} className={page===item.id?'active':''} onClick={()=>setPage(item.id)}><span>{item.icon}</span><small>{item.label}</small>{item.id==='approvals'&&pending>0&&<i>{pending}</i>}</button>)}</nav>
  </div>
}
