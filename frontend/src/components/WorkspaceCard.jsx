import { Link } from 'react-router-dom'
import './WorkspaceCard.css'

export default function WorkspaceCard({ workspace }) {
  return (
    <Link to={`/workspaces/${workspace.id}`} className="workspace-card animate-in">
      <div className="wc-top">
        <div className="wc-icon">⊞</div>
        <span className={`wc-visibility ${workspace.visibility === 'PRIVATE' ? 'private' : 'public'}`}>
          {workspace.visibility === 'PRIVATE' ? '🔒' : '◉'} {workspace.visibility}
        </span>
      </div>
      <h3 className="wc-name">{workspace.name}</h3>
      {workspace.description && <p className="wc-desc">{workspace.description}</p>}
      <div className="wc-footer">
        <span className="wc-owner mono">@{workspace.ownerUsername}</span>
        <span className="wc-count">{workspace.promptCount} prompt{workspace.promptCount !== 1 ? 's' : ''}</span>
      </div>
    </Link>
  )
}
