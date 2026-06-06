import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getWorkspaceById } from '../api/workspaces'
import { getPromptsByWorkspace } from '../api/prompts'
import PromptCard from '../components/PromptCard'
import './WorkspaceDetailPage.css'

export default function WorkspaceDetailPage() {
  const { id } = useParams()
  const [workspace, setWorkspace] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const [ws, ps] = await Promise.all([getWorkspaceById(id), getPromptsByWorkspace(id)])
      setWorkspace(ws); setPrompts(ps)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  if (loading) return <div className="page"><div className="skeleton" style={{ height: 300 }} /></div>
  if (!workspace) return <div className="page"><div className="empty-state">Workspace not found.</div></div>

  return (
    <div className="page">
      <div className="detail-nav">
        <Link to="/workspaces" className="back-link">← Workspaces</Link>
      </div>

      <div className="ws-detail-header">
        <div className="ws-detail-icon">⊞</div>
        <div>
          <div className="ws-detail-meta">
            <span className={`wc-visibility ${workspace.visibility === 'PRIVATE' ? 'private' : 'public'}`}>
              {workspace.visibility === 'PRIVATE' ? '🔒' : '◉'} {workspace.visibility}
            </span>
            <Link to={`/users/${workspace.ownerId}`} className="ws-detail-owner mono">@{workspace.ownerUsername}</Link>
          </div>
          <h1 className="ws-detail-name">{workspace.name}</h1>
          {workspace.description && <p className="ws-detail-desc">{workspace.description}</p>}
        </div>
      </div>

      <div className="ws-detail-section">
        <h2 className="section-title">
          <span>Prompts</span>
          <span className="section-count mono">{prompts.length}</span>
        </h2>
        <div className="prompts-grid">
          {prompts.map(p => <PromptCard key={p.id} prompt={p} onStarChange={load} />)}
          {prompts.length === 0 && <div className="empty-state">No prompts in this workspace yet.</div>}
        </div>
      </div>
    </div>
  )
}
