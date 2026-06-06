import { useState } from 'react'
import { Link } from 'react-router-dom'
import { starPrompt, unstarPrompt } from '../api/prompts'
import { useActiveUser } from '../hooks/UserContext'
import './PromptCard.css'

const CATEGORY_COLORS = {
  CODING:      { bg: '#0f2a52', text: '#4a9eff' },
  WRITING:     { bg: '#1a3a1a', text: '#3ddc84' },
  ANALYSIS:    { bg: '#2a1a40', text: '#b07cff' },
  CREATIVE:    { bg: '#3a1a2a', text: '#ff7cb0' },
  PRODUCTIVITY:{ bg: '#3a2a0a', text: '#f5a623' },
  GENERAL:     { bg: '#1c2233', text: '#8a97b0' },
}

export default function PromptCard({ prompt, onStarChange }) {
  const { activeUserId } = useActiveUser()
  const [starring, setStarring] = useState(false)

  const cat = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.GENERAL

  async function handleStar(e) {
    e.preventDefault()
    if (starring) return
    setStarring(true)
    try {
      await starPrompt(prompt.id, activeUserId)
      onStarChange?.()
    } catch (_) {
      try {
        await unstarPrompt(prompt.id, activeUserId)
        onStarChange?.()
      } catch (_) {}
    } finally {
      setStarring(false)
    }
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'today'
    if (days === 1) return 'yesterday'
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Link to={`/prompts/${prompt.id}`} className="prompt-card animate-in">
      <div className="pc-header">
        <span className="pc-category" style={{ background: cat.bg, color: cat.text }}>
          {prompt.category}
        </span>
        <button
          className={`pc-star ${starring ? 'starring' : ''}`}
          onClick={handleStar}
          title="Star this prompt"
        >
          ★ <span>{prompt.starCount}</span>
        </button>
      </div>

      <h3 className="pc-title">{prompt.title}</h3>
      {prompt.description && <p className="pc-desc">{prompt.description}</p>}

      <div className="pc-preview mono">{prompt.content.slice(0, 120)}{prompt.content.length > 120 ? '…' : ''}</div>

      <div className="pc-footer">
        <span className="pc-author">@{prompt.authorUsername}</span>
        {prompt.workspaceName && (
          <span className="pc-workspace">
            <span className="pc-workspace-icon">⊞</span> {prompt.workspaceName}
          </span>
        )}
        <span className="pc-date">{timeAgo(prompt.updatedAt || prompt.createdAt)}</span>
      </div>
    </Link>
  )
}
