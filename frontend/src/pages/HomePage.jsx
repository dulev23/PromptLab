import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import PromptCard from '../components/PromptCard'
import './HomePage.css'

export default function HomePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('recent')

  async function load() {
    try {
      setData(await getDashboard())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="page">
      <div className="home-hero">
        <div className="skeleton" style={{ height: 40, width: 320, marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 20, width: 240 }} />
      </div>
      <div className="stats-row">
        {[1,2,3].map(i => <div key={i} className="skeleton stat-card-skeleton" />)}
      </div>
    </div>
  )

  const prompts = tab === 'recent' ? data.recentPrompts : data.mostStarredPrompts

  return (
    <div className="page">
      <div className="home-hero">
        <div className="hero-badge mono">// dashboard</div>
        <h1 className="hero-title">
          Welcome to <span className="hero-accent">PromptLab</span>
        </h1>
        <p className="hero-sub">Discover, create and share AI prompts across your workspaces.</p>
        <div className="hero-actions">
          <Link to="/prompts" className="btn btn-primary">Browse Prompts</Link>
          <Link to="/workspaces" className="btn btn-secondary">View Workspaces</Link>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{data.totalUsers}</div>
          <div className="stat-label">Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.totalWorkspaces}</div>
          <div className="stat-label">Workspaces</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.totalPrompts}</div>
          <div className="stat-label">Prompts</div>
        </div>
      </div>

      <div className="home-tabs">
        <button className={`home-tab ${tab === 'recent' ? 'active' : ''}`} onClick={() => setTab('recent')}>
          Recent Prompts
        </button>
        <button className={`home-tab ${tab === 'starred' ? 'active' : ''}`} onClick={() => setTab('starred')}>
          ★ Most Starred
        </button>
      </div>

      <div className="prompts-grid">
        {prompts.map(p => (
          <PromptCard key={p.id} prompt={p} onStarChange={load} />
        ))}
        {prompts.length === 0 && (
          <div className="empty-state">No prompts yet. <Link to="/prompts">Create one!</Link></div>
        )}
      </div>
    </div>
  )
}
