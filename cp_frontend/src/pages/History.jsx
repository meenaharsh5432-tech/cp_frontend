import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, History as HistoryIcon, Settings } from 'lucide-react'
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
      <aside className="w-56 shrink-0 border-r border-gray-900 flex flex-col p-4 hidden md:flex">
        <div className="font-bold text-base tracking-tight mb-8">
          Content<span className="text-brand-400">Pilot</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors"
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium"
          >
            <HistoryIcon size={15} /> History
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors"
          >
            <Settings size={15} /> Settings
          </Link>
        </nav>
        <div className="space-y-4 border-t border-gray-900 pt-4">
          {user && <QuotaBar user={user} onUpgrade={() => navigate('/settings')} />}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1">History</h1>
          <p className="text-sm text-gray-400">Your last 20 repurposes.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <JobHistory jobs={jobs} onSelect={handleSelect} />
        )}
      </main>
    </div>
  )
}
