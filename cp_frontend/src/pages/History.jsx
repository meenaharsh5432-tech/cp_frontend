import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, History as HistoryIcon, Settings, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useJobs } from '../hooks/useJobs'
import JobHistory from '../components/JobHistory'
import QuotaBar from '../components/QuotaBar'

export default function History() {
  const { user, logout } = useAuth()
  const { data: jobs, isLoading } = useJobs()
  const navigate = useNavigate()

  function handleSelect(jobId) {
    navigate(`/dashboard?job=${jobId}`)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-gray-900 flex flex-col hidden md:flex bg-gray-950">
        <div className="px-5 py-5 border-b border-gray-900">
          <div className="font-black text-lg tracking-tight">
            Content<span className="gradient-text">Pilot</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 text-sm font-medium transition-colors">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-600/15 text-brand-300 text-sm font-semibold border border-brand-500/20">
            <HistoryIcon size={16} /> History
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 text-sm font-medium transition-colors">
            <Settings size={16} /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-900 space-y-4">
          {user && <QuotaBar user={user} onUpgrade={() => navigate('/settings')} />}
          {user?.tier === 'free' && (
            <Link to="/settings" className="flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-brand-600/20 to-violet-600/20 hover:from-brand-600/30 hover:to-violet-600/30 border border-brand-500/30 text-brand-300 py-2.5 rounded-xl transition-all font-medium">
              <Zap size={12} /> Upgrade plan
            </Link>
          )}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-300 truncate">{user?.name}</div>
              <div className="text-xs text-gray-600 truncate capitalize">{user?.tier} plan</div>
            </div>
            <button onClick={logout} className="text-gray-600 hover:text-gray-300 transition-colors" title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">History</h1>
            <p className="text-sm text-gray-500 mt-1">Your last 20 repurposes.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <JobHistory jobs={jobs} onSelect={handleSelect} />
          )}
        </div>
      </main>
    </div>
  )
}
