import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './hooks/UserContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PromptsPage from './pages/PromptsPage'
import PromptDetailPage from './pages/PromptDetailPage'
import WorkspacesPage from './pages/WorkspacesPage'
import WorkspaceDetailPage from './pages/WorkspaceDetailPage'
import UsersPage from './pages/UsersPage'
import UserProfilePage from './pages/UserProfilePage'
import './App.css'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/"                    element={<HomePage />} />
            <Route path="/prompts"             element={<PromptsPage />} />
            <Route path="/prompts/:id"         element={<PromptDetailPage />} />
            <Route path="/workspaces"          element={<WorkspacesPage />} />
            <Route path="/workspaces/:id"      element={<WorkspaceDetailPage />} />
            <Route path="/users"               element={<UsersPage />} />
            <Route path="/users/:id"           element={<UserProfilePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </UserProvider>
  )
}
