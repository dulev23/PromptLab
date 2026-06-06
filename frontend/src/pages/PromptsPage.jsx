import { useState, useEffect } from 'react'
import { getAllPrompts, createPrompt, updatePrompt, deletePrompt } from '../api/prompts'
import { getAllWorkspaces } from '../api/workspaces'
import { useActiveUser } from '../hooks/UserContext'
import PromptCard from '../components/PromptCard'
import Modal from '../components/Modal'
import './PromptsPage.css'

const CATEGORIES = ['ALL', 'GENERAL', 'CODING', 'WRITING', 'ANALYSIS', 'CREATIVE', 'PRODUCTIVITY']
const EMPTY_FORM = { title: '', content: '', description: '', category: 'GENERAL', workspaceId: '' }

function PromptForm({ form, setForm, workspaces, onSubmit, onCancel, saving }) {
  const field = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
              className="form-input"
              value={form.title}
              onChange={e => field('title', e.target.value)}
              required
              placeholder="e.g. Code Review Helper"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Prompt Content</label>
          <textarea
              className="form-textarea"
              style={{ minHeight: 140 }}
              value={form.content}
              onChange={e => field('content', e.target.value)}
              required
              placeholder="Write your prompt here. Use {variables} for placeholders."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <input
              className="form-input"
              value={form.description}
              onChange={e => field('description', e.target.value)}
              placeholder="Short summary of what this prompt does"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => field('category', e.target.value)}>
              {CATEGORIES.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Workspace (optional)</label>
            <select className="form-select" value={form.workspaceId} onChange={e => field('workspaceId', e.target.value)}>
              <option value="">None</option>
              {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Prompt'}
          </button>
        </div>
      </form>
  )
}

export default function PromptsPage() {
  const { activeUserId } = useActiveUser()
  const [prompts, setPrompts]     = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('ALL')
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)

  async function load() {
    try {
      const [p, w] = await Promise.all([getAllPrompts(), getAllWorkspaces()])
      setPrompts(p)
      setWorkspaces(w)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY_FORM); setShowCreate(true) }

  function openEdit(prompt, e) {
    e.preventDefault()
    setEditTarget(prompt)
    setForm({
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || '',
      category: prompt.category,
      workspaceId: prompt.workspaceId || '',
    })
  }

  function closeModals() { setShowCreate(false); setEditTarget(null) }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true)
    try {
      await createPrompt(activeUserId, { ...form, workspaceId: form.workspaceId || null })
      await load(); closeModals()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleEdit(e) {
    e.preventDefault(); setSaving(true)
    try {
      await updatePrompt(editTarget.id, { ...form, workspaceId: form.workspaceId || null })
      await load(); closeModals()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleDelete(id, e) {
    e.preventDefault()
    if (!confirm('Delete this prompt?')) return
    await deletePrompt(id)
    await load()
  }

  const filtered = prompts.filter(p => {
    const matchCat    = category === 'ALL' || p.category === category
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
      <div className="page">
        <div className="page-header">
          <div>
            <div className="mono page-eyebrow">prompts</div>
            <h1 className="page-title">All Prompts</h1>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ New Prompt</button>
        </div>

        <div className="filters-bar">
          <input
              className="search-input"
              placeholder="Search prompts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
          />
          <div className="cat-filters">
            {CATEGORIES.map(c => (
                <button key={c} className={`cat-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
            ))}
          </div>
        </div>

        {loading ? (
            <div className="prompts-grid">
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
            </div>
        ) : (
            <div className="prompts-grid">
              {filtered.map(p => (
                  <div key={p.id} className="card-wrapper">
                    <PromptCard prompt={p} onStarChange={load} />
                    {p.authorId === activeUserId && (
                        <div className="card-actions">
                          <button className="card-action-btn edit" onClick={e => openEdit(p, e)}>Edit</button>
                          <button className="card-action-btn delete" onClick={e => handleDelete(p.id, e)}>Delete</button>
                        </div>
                    )}
                  </div>
              ))}
              {filtered.length === 0 && (
                  <div className="empty-state">No prompts match your filters.</div>
              )}
            </div>
        )}

        {showCreate && (
            <Modal title="Create New Prompt" onClose={closeModals}>
              <PromptForm
                  form={form} setForm={setForm}
                  workspaces={workspaces}
                  onSubmit={handleCreate}
                  onCancel={closeModals}
                  saving={saving}
              />
            </Modal>
        )}

        {editTarget && (
            <Modal title="Edit Prompt" onClose={closeModals}>
              <PromptForm
                  form={form} setForm={setForm}
                  workspaces={workspaces}
                  onSubmit={handleEdit}
                  onCancel={closeModals}
                  saving={saving}
              />
            </Modal>
        )}
      </div>
  )
}