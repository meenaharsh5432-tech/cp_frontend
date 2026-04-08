import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, History, Settings, LogOut, ChevronDown } from 'lucide-react'
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
  'Generating your Twitter thread...',
  'Writing your LinkedIn post...',
  'Almost done...'
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
    } catch (e) {
      // Silent — not critical
    }
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

  function handleUpgrade() {
    window.location.href = '/settings'
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
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium"
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            to="/history"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors"
          >
            <History size={15} /> History
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors"
          >
            <Settings size={15} /> Settings
          </Link>
        </nav>

        <div className="space-y-4 border-t border-gray-900 pt-4">
          {user && <QuotaBar user={user} onUpgrade={handleUpgrade} />}

          {user?.tier === 'free' && (
            <Link
              to="/settings"
              className="block text-center text-xs bg-brand-600/20 hover:bg-brand-600/30 border border-brand-600/30 text-brand-400 py-2 rounded-lg transition-colors"
            >
              Upgrade for more
            </Link>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1">Repurpose content</h1>
          <p className="text-sm text-gray-400">Paste any content and get 4 formats in your voice.</p>
        </div>

        {/* Voice selector */}
        <div className="mb-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Voice</div>
          <VoiceSelector value={voiceOverride} onChange={handleVoiceChange} />
        </div>

        {/* Input */}
        <div className="mb-6">
          <InputTabs onSubmit={handleSubmit} isLoading={createJob.isPending} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Loading state */}
        {createJob.isPending && (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm">{loadingMsg}</p>
          </div>
        )}

        {/* Output */}
        {currentJob && !createJob.isPending && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Your outputs</h2>
              <span className="text-xs text-gray-500">
                {currentJob.voiceProfile} voice
              </span>
            </div>
            <OutputCard job={currentJob} />
          </div>
        )}
      </main>
    </div>
  )
}
