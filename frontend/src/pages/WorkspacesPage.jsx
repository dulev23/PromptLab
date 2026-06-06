import { useState, useEffect } from 'react'
import { getAllWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from '../api/workspaces'
import { useActiveUser } from '../hooks/UserContext'
import WorkspaceCard from '../components/WorkspaceCard'
import Modal from '../components/Modal'
import './WorkspacesPage.css'

const EMPTY_FORM = { name: '', description: '', visibility: 'PUBLIC' }

function WorkspaceForm({ form, setForm, onSubmit, onCancel, saving }) {
  const field = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
              className="form-input"
              value={form.name}
              onChange={e => field('name', e.target.value)}
              required
              placeholder="e.g. AI Writing Tools"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea
              className="form-textarea"
              style={{ minHeight: 80 }}
              value={form.description}
              onChange={e => field('description', e.target.value)}
              placeholder="What prompts will live here?"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Visibility</label>
          <div className="visibility-toggle">
            {['PUBLIC', 'PRIVATE'].map(v => (
                <button
                    key={v}
                    type="button"
                    className={`vis-btn ${form.visibility === v ? 'active' : ''}`}
                    onClick={() => field('visibility', v)}
                >
                  {v === 'PUBLIC' ? '◉ Public' : '🔒 Private'}
                </button>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Workspace'}
          </button>
        </div>
      </form>
  )
}

export default function WorkspacesPage() {
  const { activeUserId } = useActiveUser()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [filter, setFilter]         = useState('ALL')

  async function load() {
    try { setWorkspaces(await getAllWorkspaces()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY_FORM); setShowCreate(true) }

  function openEdit(ws, e) {
    e.preventDefault()
    setEditTarget(ws)
    setForm({ name: ws.name, description: ws.description || '', visibility: ws.visibility })
  }

  function closeModals() { setShowCreate(false); setEditTarget(null) }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true)
    try { await createWorkspace(activeUserId, form); await load(); closeModals() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleEdit(e) {
    e.preventDefault(); setSaving(true)
    try { await updateWorkspace(editTarget.id, form); await load(); closeModals() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleDelete(id, e) {
    e.preventDefault()
    if (!confirm('Delete this workspace and all its prompts?')) return
    await deleteWorkspace(id); await load()
  }

  const filtered = filter === 'MINE'
      ? workspaces.filter(w => w.ownerId === activeUserId)
      : workspaces

  return (
      <div className="page">
        <div className="page-header">
          <div>
            <div className="mono page-eyebrow">workspaces</div>
            <h1 className="page-title">Workspaces</h1>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ New Workspace</button>
        </div>

        <div className="ws-filter-bar">
          <button className={`cat-btn ${filter === 'ALL'  ? 'active' : ''}`} onClick={() => setFilter('ALL')}>All</button>
          <button className={`cat-btn ${filter === 'MINE' ? 'active' : ''}`} onClick={() => setFilter('MINE')}>Mine</button>
        </div>

        {loading ? (
            <div className="ws-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 160 }} />)}
            </div>
        ) : (
            <div className="ws-grid">
              {filtered.map(ws => (
                  <div key={ws.id} className="card-wrapper">
                    <WorkspaceCard workspace={ws} />
                    {ws.ownerId === activeUserId && (
                        <div className="card-actions">
                          <button className="card-action-btn edit"   onClick={e => openEdit(ws, e)}>Edit</button>
                          <button className="card-action-btn delete" onClick={e => handleDelete(ws.id, e)}>Delete</button>
                        </div>
                    )}
                  </div>
              ))}
              {filtered.length === 0 && <div className="empty-state">No workspaces yet.</div>}
            </div>
        )}

        {showCreate && (
            <Modal title="Create Workspace" onClose={closeModals}>
              <WorkspaceForm form={form} setForm={setForm} onSubmit={handleCreate} onCancel={closeModals} saving={saving} />
            </Modal>
        )}

        {editTarget && (
            <Modal title="Edit Workspace" onClose={closeModals}>
              <WorkspaceForm form={form} setForm={setForm} onSubmit={handleEdit} onCancel={closeModals} saving={saving} />
            </Modal>
        )}
      </div>
  )
}