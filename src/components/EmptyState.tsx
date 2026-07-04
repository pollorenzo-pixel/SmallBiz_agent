export function EmptyState({ title, text }: { title: string; text: string }) { return <div className="empty"><div className="empty-mark">◇</div><strong>{title}</strong><p>{text}</p></div> }
