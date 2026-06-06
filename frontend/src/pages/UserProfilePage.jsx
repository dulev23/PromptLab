import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserById, updateUser } from '../api/users'
import { getPromptsByAuthor, getStarredPrompts } from '../api/prompts'
import { getWorkspacesByOwner } from '../api/workspaces'
import { useActiveUser } from '../hooks/UserContext'
import PromptCard from '../components/PromptCard'
import WorkspaceCard from '../components/WorkspaceCard'
import Modal from '../components/Modal'
import './UserProfilePage.css'
import maleAvatar from '../assets/male_avatar.png'


export default function UserProfilePage() {
  const { id } = useParams()
  const { activeUserId } = useActiveUser()
  const isBlockedAvatar = (url) =>
      url && url.includes('file_00000000bf887246af942472bcc9ffa7')

  const [user, setUser] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [starred, setStarred] = useState([])
  const [loading, setLoading] = useState(true)

  const [tab, setTab] = useState('prompts')
  const [showEdit, setShowEdit] = useState(false)

  const [form, setForm] = useState({ avatarUrl: '', bio: '' })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      const [u, p, w, s] = await Promise.all([
        getUserById(id),
        getPromptsByAuthor(id),
        getWorkspacesByOwner(id),
        getStarredPrompts(id),
      ])
      setUser(u)
      setPrompts(p)
      setWorkspaces(w)
      setStarred(s)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    load()
  }, [id])

  function openEdit() {
    setForm({
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || ''
    })
    setAvatarPreview(user.avatarUrl || '')
    setShowEdit(true)
  }

  async function handleEdit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      await updateUser(id, {
        avatarUrl: isBlockedAvatar(form.avatarUrl) ? null : form.avatarUrl,
        bio: form.bio
      })

      await load()
      setShowEdit(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const isOwner = parseInt(id) === activeUserId

  if (loading) {
    return (
        <div className="page">
          <div className="skeleton" style={{ height: 200, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 40, width: 300 }} />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="page">
          <div className="empty-state">User not found.</div>
        </div>
    )
  }

  const tabContent = {
    prompts,
    workspaces,
    starred
  }

  return (
      <div className="page">

        {/* PROFILE HEADER */}
        <div className="profile-header">

          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <img
                  src={
                    isBlockedAvatar(user.avatarUrl)
                        ? maleAvatar
                        : user.avatarUrl || maleAvatar
                  }
                  alt={user.username}
              />
            </div>

            {isOwner && <span className="profile-you-badge">you</span>}
          </div>

          <div className="profile-info">
            <div className="profile-username mono">@{user.username}</div>
            <div className="profile-email">{user.email}</div>

            {user.bio && <p className="profile-bio">{user.bio}</p>}

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-val mono">{user.promptCount}</span>
                <span className="profile-stat-label">Prompts</span>
              </div>

              <div className="profile-stat">
                <span className="profile-stat-val mono">{user.workspaceCount}</span>
                <span className="profile-stat-label">Workspaces</span>
              </div>

              <div className="profile-stat">
                <span className="profile-stat-val mono">{starred.length}</span>
                <span className="profile-stat-label">Starred</span>
              </div>
            </div>

            <div className="profile-meta mono">
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
            </div>
          </div>

          {isOwner && (
              <button className="btn btn-secondary profile-edit-btn" onClick={openEdit}>
                Edit Profile
              </button>
          )}
        </div>

        {/* TABS */}
        <div className="profile-tabs">
          {[
            { key: 'prompts', label: `Prompts (${prompts.length})` },
            { key: 'workspaces', label: `Workspaces (${workspaces.length})` },
            { key: 'starred', label: `★ Starred (${starred.length})` }
          ].map(t => (
              <button
                  key={t.key}
                  className={`profile-tab ${tab === t.key ? 'active' : ''}`}
                  onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
          ))}
        </div>

        {/* CONTENT */}
        {tab === 'workspaces' ? (
            <div className="ws-grid">
              {workspaces.map(w => (
                  <WorkspaceCard key={w.id} workspace={w} />
              ))}
              {workspaces.length === 0 && (
                  <div className="empty-state">No workspaces yet.</div>
              )}
            </div>
        ) : (
            <div className="prompts-grid">
              {tabContent[tab].map(p => (
                  <PromptCard key={p.id} prompt={p} onStarChange={load} />
              ))}

              {tabContent[tab].length === 0 && (
                  <div className="empty-state">
                    {tab === 'starred'
                        ? 'No starred prompts yet.'
                        : 'No prompts yet.'}
                  </div>
              )}
            </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
            <Modal title="Edit Profile" onClose={() => setShowEdit(false)}>
              <form onSubmit={handleEdit}>

                <div className="form-group">
                  <label className="form-label">Avatar URL</label>
                  <input
                      className="form-input"
                      value={form.avatarUrl}
                      onChange={e => {
                        const val = e.target.value
                        setForm(f => ({ ...f, avatarUrl: val }))
                        setAvatarPreview(val)
                      }}
                      placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                      className="form-textarea"
                      value={form.bio}
                      onChange={e =>
                          setForm(f => ({ ...f, bio: e.target.value }))
                      }
                      placeholder="Tell the community about yourself"
                  />
                </div>

                <div className="form-actions">
                  <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEdit(false)}
                  >
                    Cancel
                  </button>

                  <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                </div>

              </form>
            </Modal>
        )}

      </div>
  )
}