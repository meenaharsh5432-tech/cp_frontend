import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, History, Settings, LogOut, Zap, Sparkles } from 'lucide-react'
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
    <aside className="w-60 shrink-0 border-r border-gray-900 flex flex-col hidden md:flex bg-gray-950">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-900">
        <div className="font-black text-lg tracking-tight">
          Content<span className="gradient-text">Pilot</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-600/15 text-brand-300 text-sm font-semibold border border-brand-500/20"
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link
          to="/history"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 text-sm font-medium transition-colors"
        >
          <History size={16} /> History
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 text-sm font-medium transition-colors"
        >
          <Settings size={16} /> Settings
        </Link>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-900 space-y-4">
        {user && <QuotaBar user={user} onUpgrade={() => window.location.href = '/settings'} />}

        {user?.tier === 'free' && (
          <Link
            to="/settings"
            className="flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-brand-600/20 to-violet-600/20 hover:from-brand-600/30 hover:to-violet-600/30 border border-brand-500/30 text-brand-300 py-2.5 rounded-xl transition-all font-medium"
          >
            <Zap size={12} /> Upgrade plan
          </Link>
        )}

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-300 truncate">{user?.name}</div>
            <div className="text-xs text-gray-600 truncate">{user?.tier} plan</div>
          </div>
          <button onClick={logout} className="text-gray-600 hover:text-gray-300 transition-colors" title="Sign out">
            <LogOut size={14} />
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

  const [currentJobId, setCurrentJobId] = useState(null)
  const [voiceOverride, setVoiceOverride] = useState(user?.voiceProfile || 'developer')
  const [error, setError] = useState(null)

  const { data: currentJob } = useJob(currentJobId)
  const loadingMsg = useLoadingMessage(createJob.isPending)

  async function handleVoiceChange(profile) {
    setVoiceOverride(profile)
    try {
      await api.patch('/api/voice', { voiceProfile: profile })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    } catch {}
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
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar user={user} logout={logout} />

      {/* Main */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white">Repurpose content</h1>
            <p className="text-sm text-gray-500 mt-1">Paste any content and get 4 formats written in your voice.</p>
          </div>

          {/* Voice selector */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-brand-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Voice profile</span>
            </div>
            <VoiceSelector value={voiceOverride} onChange={handleVoiceChange} />
          </div>

          {/* Input */}
          <div className="card p-4">
            <InputTabs onSubmit={handleSubmit} isLoading={createJob.isPending} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Loading */}
          {createJob.isPending && (
            <div className="card p-12 text-center animate-fade-in">
              <div className="relative w-12 h-12 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                <Sparkles size={16} className="absolute inset-0 m-auto text-brand-400" />
              </div>
              <p className="text-sm font-medium text-gray-300">{loadingMsg}</p>
              <p className="text-xs text-gray-600 mt-1">Generating 4 formats in parallel...</p>
            </div>
          )}

          {/* Output */}
          {currentJob && !createJob.isPending && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Your outputs</h2>
                <span className="text-xs text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full capitalize">
                  {currentJob.voiceProfile} voice
                </span>
              </div>
              <OutputCard job={currentJob} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
