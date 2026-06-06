import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers } from '../api/users'
import { useActiveUser } from '../hooks/UserContext'
import './UsersPage.css'

export default function UsersPage() {
    const { activeUserId } = useActiveUser()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filtered = users.filter(u =>
        !search ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.bio && u.bio.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--amber)', marginBottom: 6 }}>// users</div>
                    <h1 className="page-title">Community</h1>
                </div>
            </div>

            <input
                className="search-input"
                style={{ marginBottom: 24, maxWidth: 400 }}
                placeholder="Search users…"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
                <div className="users-grid">
                    {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
                </div>
            ) : (
                <div className="users-grid">
                    {filtered.map(u => (
                        <Link key={u.id} to={`/users/${u.id}`} className="user-card animate-in">
                            <div className="user-card-avatar">
                                <img
                                    src={u.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${u.username}&backgroundColor=0d3330&textColor=2dd4bf&fontSize=40`}
                                    alt={u.username}
                                />
                                {u.id === activeUserId && <span className="you-badge">you</span>}
                            </div>
                            <div className="user-card-info">
                                <div className="user-card-name mono">@{u.username}</div>
                                {u.bio && <p className="user-card-bio">{u.bio}</p>}
                                <div className="user-card-stats">
                                    <span>{u.workspaceCount} workspace{u.workspaceCount !== 1 ? 's' : ''}</span>
                                    <span>·</span>
                                    <span>{u.promptCount} prompt{u.promptCount !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filtered.length === 0 && <div className="empty-state">No users found.</div>}
                </div>
            )}
        </div>
    )
}