import { Link, useLocation } from 'react-router-dom'
import { useActiveUser } from '../hooks/UserContext'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const { activeUserId } = useActiveUser()

  const links = [
    { to: '/',           label: 'Dashboard' },
    { to: '/prompts',    label: 'Prompts' },
    { to: '/workspaces', label: 'Workspaces' },
    { to: '/users',      label: 'Users' },
  ]

  return (
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-bracket">[</span>
            <span className="logo-text">PromptLab</span>
            <span className="logo-bracket">]</span>
          </Link>

          <div className="navbar-links">
            {links.map(l => (
                <Link
                    key={l.to}
                    to={l.to}
                    className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
                >
                  {l.label}
                </Link>
            ))}
          </div>

          <Link to={`/users/${activeUserId}`} className="navbar-avatar" title="My Profile">
            <div className="avatar-ring">
              <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=User${activeUserId}&backgroundColor=0d3330&textColor=2dd4bf&fontSize=40`}
                  alt="My Profile"
                  className="avatar-img"
              />
            </div>
          </Link>
        </div>
      </nav>
  )
}