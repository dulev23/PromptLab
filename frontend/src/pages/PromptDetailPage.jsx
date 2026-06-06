import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPromptById, starPrompt, unstarPrompt, deletePrompt, updatePrompt } from '../api/prompts'
import { getAllWorkspaces } from '../api/workspaces'
import { useActiveUser } from '../hooks/UserContext'
import Modal from '../components/Modal'
import './PromptDetailPage.css'

const CATEGORIES = ['GENERAL', 'CODING', 'WRITING', 'ANALYSIS', 'CREATIVE', 'PRODUCTIVITY']

function EditForm({ form, setForm, workspaces, onSubmit, onCancel, saving }) {
  const field = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" value={form.title} onChange={e => field('title', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Prompt Content</label>
          <textarea
              className="form-textarea"
              style={{ minHeight: 160 }}
              value={form.content}
              onChange={e => field('content', e.target.value)}
              required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" value={form.description} onChange={e => field('description', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => field('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Workspace</label>
            <select className="form-select" value={form.workspaceId} onChange={e => field('workspaceId', e.target.value)}>
              <option value="">None</option>
              {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
  )
}

export default function PromptDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { activeUserId } = useActiveUser()
  const [prompt, setPrompt]       = useState(null)
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading]     = useState(true)
  const [copying, setCopying]     = useState(false)
  const [showEdit, setShowEdit]   = useState(false)
  const [form, setForm]           = useState({})
  const [saving, setSaving]       = useState(false)

  async function load() {
    try {
      const [p, w] = await Promise.all([getPromptById(id), getAllWorkspaces()])
      setPrompt(p); setWorkspaces(w)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  async function handleStar() {
    try { await starPrompt(prompt.id, activeUserId) }
    catch (_) { await unstarPrompt(prompt.id, activeUserId) }
    await load()
  }

  async function handleDelete() {
    if (!confirm('Delete this prompt permanently?')) return
    await deletePrompt(id)
    navigate('/prompts')
  }

  function openEdit() {
    setForm({
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || '',
      category: prompt.category,
      workspaceId: prompt.workspaceId || '',
    })
    setShowEdit(true)
  }

  async function handleEdit(e) {
    e.preventDefault(); setSaving(true)
    try {
      await updatePrompt(id, { ...form, workspaceId: form.workspaceId || null })
      await load(); setShowEdit(false)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.content)
    setCopying(true)
    setTimeout(() => setCopying(false), 1500)
  }

  if (loading) return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>
  if (!prompt)  return <div className="page"><div className="empty-state">Prompt not found.</div></div>

  const isOwner = prompt.authorId === activeUserId

  return (
      <div className="page">
        <div className="detail-nav">
          <Link to="/prompts" className="back-link">← Prompts</Link>
          {prompt.workspaceName && (
              <Link to={`/workspaces/${prompt.workspaceId}`} className="back-link">⊞ {prompt.workspaceName}</Link>
          )}
        </div>

        <div className="detail-header">
          <div className="detail-meta">
            <span className="detail-cat">{prompt.category}</span>
            {prompt.updatedAt && <span className="detail-updated mono">edited</span>}
          </div>
          <h1 className="detail-title">{prompt.title}</h1>
          {prompt.description && <p className="detail-desc">{prompt.description}</p>}
          <div className="detail-byline">
            <Link to={`/users/${prompt.authorId}`} className="detail-author mono">@{prompt.authorUsername}</Link>
            <span className="detail-date mono">
            {new Date(prompt.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          </div>
        </div>

        <div className="detail-content-box">
          <div className="detail-content-header">
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>prompt.txt</span>
            <button className="copy-btn" onClick={handleCopy}>
              {copying ? '✓ Copied!' : '⎘ Copy'}
            </button>
          </div>
          <pre className="detail-content">{prompt.content}</pre>
        </div>

        <div className="detail-actions">
          <button className="star-btn" onClick={handleStar}>
            ★ Star <span className="star-count">{prompt.starCount}</span>
          </button>
          {isOwner && (
              <>
                <button className="btn btn-secondary" onClick={openEdit}>Edit</button>
                <button className="btn btn-danger"    onClick={handleDelete}>Delete</button>
              </>
          )}
        </div>

        {showEdit && (
            <Modal title="Edit Prompt" onClose={() => setShowEdit(false)}>
              <EditForm
                  form={form} setForm={setForm}
                  workspaces={workspaces}
                  onSubmit={handleEdit}
                  onCancel={() => setShowEdit(false)}
                  saving={saving}
              />
            </Modal>
        )}
      </div>
  )
}