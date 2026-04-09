import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LayoutDashboard, History as HistoryIcon, Settings as SettingsIcon, LogOut, Zap, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCreateJob, useJob, useJobs } from '../hooks/useJobs'
import QuotaBar from '../components/QuotaBar'
import InputTabs from '../components/InputTabs'
import OutputCard from '../components/OutputCard'
import VoiceSelector from '../components/VoiceSelector'
import api from '../lib/api'
import { useQueryClient } from '@tanstack/react-query'

const LOADING_MESSAGES = [
  'Extracting content...',
  'Analysing structure...',
  'Writing your Twitter thread...',
  'Crafting your LinkedIn post...',
  'Almost there...'
]

function useLoadingMessage(isLoading) {
  const [msgIndex, setMsgIndex] = useState(0)

  useState(() => {
    if (!isLoading) return
    setMsgIndex(0)
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1))
    }, 2200)
    return () => clearInterval(interval)
  })

  return LOADING_MESSAGES[msgIndex]
}

function Sidebar({ user, logout }) {
  return (
    <aside className="w-64 shrink-0 flex-col hidden md:flex glass-panel h-screen z-10 shadow-sm relative">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/60">
        <div className="font-black text-xl tracking-tight text-slate-800">
          Content<span className="text-brand-600">Pilot</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1.5">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-bold border border-brand-200/50 shadow-sm transition-all"
        >
          <LayoutDashboard size={18} className="text-brand-600" /> Dashboard
        </Link>
        <Link
          to="/history"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 text-sm font-semibold transition-all"
        >
          <HistoryIcon size={18} /> History
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 text-sm font-semibold transition-all"
        >
          <SettingsIcon size={18} /> Settings
        </Link>
      </nav>

      {/* Bottom */}
      <div className="p-5 border-t border-white/60 space-y-5 bg-white/30 backdrop-blur-md">
        {user && <QuotaBar user={user} onUpgrade={() => window.location.href = '/settings'} />}

        {user?.tier === 'free' && (
          <Link
            to="/settings"
            className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 text-brand-700 hover:shadow-md py-3 rounded-xl transition-all font-bold hover:-translate-y-0.5 hover:from-white hover:to-white"
          >
            <Zap size={14} className="text-amber-500" /> Upgrade plan
          </Link>
        )}

        {/* User */}
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
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const createJob = useCreateJob()
  const { data: jobs } = useJobs()
  const [searchParams] = useSearchParams()

  const [currentJobId, setCurrentJobId] = useState(searchParams.get('job') || null)
  const [voiceOverride, setVoiceOverride] = useState(user?.voiceProfile || 'developer')
  const [error, setError] = useState(null)

  const { data: currentJob } = useJob(currentJobId)
  const loadingMsg = useLoadingMessage(createJob.isPending)

  async function handleVoiceChange(profile) {
    setVoiceOverride(profile)
    try {
      await api.patch('/api/voice', { voiceProfile: profile })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    } catch { }
  }

  async function handleSubmit({ inputType, input }) {
    setError(null)
    try {
      const job = await createJob.mutateAsync({ inputType, input })
      setCurrentJobId(job.id)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Mesh background for the main area to make glassmorphism pop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-[100px] animate-float opacity-80" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[80px] animate-float opacity-80" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-float opacity-80" style={{ animationDelay: '4s' }} />
      </div>

      <Sidebar user={user} logout={logout} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto scrollbar-thin z-10 relative">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

          {/* Header */}
          <div className="glass-card p-6 border-l-4 border-l-brand-500">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Repurpose content</h1>
            <p className="text-base text-slate-600 mt-2 font-medium">Paste any content and get 4 premium formats written in your voice.</p>
          </div>

          {/* Voice selector */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-brand-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Voice profile</span>
            </div>
            <VoiceSelector value={voiceOverride} onChange={handleVoiceChange} />
          </div>

          {/* Input */}
          <div className="glass-card p-6 pb-2">
            <InputTabs onSubmit={handleSubmit} isLoading={createJob.isPending} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-sm rounded-xl px-5 py-4 shadow-sm animate-fade-in flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <LogOut size={16} className="text-red-500 rotate-180" />
              </div>
              {error}
            </div>
          )}

          {/* Loading */}
          {createJob.isPending && (
            <div className="glass-card p-16 text-center animate-fade-in flex flex-col items-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
                <Sparkles size={20} className="absolute inset-0 m-auto text-brand-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{loadingMsg}</h3>
              <p className="text-sm font-medium text-slate-500">Generating 4 formats in parallel. Please hold tight...</p>
            </div>
          )}

          {/* Output */}
          {currentJob && !createJob.isPending && (
            <div className="animate-slide-up space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-500" /> Your outputs
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-700 bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-full capitalize shadow-sm">
                    {currentJob.voiceProfile} voice
                  </span>
                </div>
              </div>
              <OutputCard job={currentJob} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
