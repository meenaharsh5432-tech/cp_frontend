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
    <div className="h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-[100px] animate-float opacity-80" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[80px] animate-float opacity-80" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-float opacity-80" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex-col hidden md:flex glass-panel h-screen z-10 shadow-sm relative">
        <div className="px-6 py-6 border-b border-white/60">
          <div className="font-black text-xl tracking-tight text-slate-800">
            Content<span className="text-brand-600">Pilot</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 text-sm font-semibold transition-all"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-bold border border-brand-200/50 shadow-sm transition-all"
          >
            <HistoryIcon size={18} className="text-brand-600" /> History
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 text-sm font-semibold transition-all"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>
        <div className="p-5 border-t border-white/60 space-y-5 bg-white/30 backdrop-blur-md">
          {user && <QuotaBar user={user} onUpgrade={() => navigate('/settings')} />}
          {user?.tier === 'free' && (
            <Link
              to="/settings"
              className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 text-brand-700 hover:shadow-md py-3 rounded-xl transition-all font-bold hover:-translate-y-0.5 hover:from-white hover:to-white"
            >
              <Zap size={14} className="text-amber-500" /> Upgrade plan
            </Link>
          )}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">{user?.name}</div>
              <div className="text-xs font-semibold text-slate-500 truncate capitalize">{user?.tier} plan</div>
            </div>
            <button onClick={logout} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto scrollbar-thin z-10 relative">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
          <div className="glass-card p-6 border-l-4 border-l-brand-500">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">History</h1>
            <p className="text-base text-slate-600 mt-2 font-medium">Your last 20 repurposes.</p>
          </div>

          {isLoading ? (
            <div className="glass-card p-16 flex justify-center">
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
