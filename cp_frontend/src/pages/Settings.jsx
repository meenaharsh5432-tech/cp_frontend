import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, History, Settings as SettingsIcon, Lock } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import VoiceSelector from '../components/VoiceSelector'
import QuotaBar from '../components/QuotaBar'
import api from '../lib/api'

const TIER_LABELS = { free: 'Free', solo: 'Solo', team: 'Team', scale: 'Scale' }
const QUOTA_LIMITS = { free: 3, solo: 30, team: '∞', scale: '∞' }

export default function Settings() {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [voice, setVoice] = useState(user?.voiceProfile || 'developer')
  const [customPrompt, setCustomPrompt] = useState(user?.customVoicePrompt || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  async function saveVoiceSettings() {
    setSaving(true)
    setSaveMsg('')
    try {
      await api.patch('/api/voice', { voiceProfile: voice })
      if (user?.tier !== 'free' && customPrompt) {
        await api.patch('/api/voice/custom', { customPrompt })
      }
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setSaveMsg('Saved!')
    } catch (err) {
      setSaveMsg(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  async function handleUpgrade(plan) {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      alert('Could not load payment gateway. Please try again.')
      return
    }

    try {
      const res = await api.post('/api/billing/checkout', { plan })
      const { subscriptionId, keyId } = res.data

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: 'ContentPilot',
        description: `${TIER_LABELS[plan]} Plan`,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#6d28d9' },
        handler: async function (response) {
          try {
            await api.post('/api/billing/verify', response)
            queryClient.invalidateQueries({ queryKey: ['me'] })
            window.location.href = '/dashboard?upgraded=true'
          } catch {
            alert('Payment recorded but verification failed. Contact support.')
          }
        }
      })
      rzp.open()
    } catch (err) {
      alert(err.response?.data?.error || 'Could not start checkout')
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Cancel your subscription? You will be downgraded to Free immediately.')) return
    try {
      await api.post('/api/billing/cancel')
      queryClient.invalidateQueries({ queryKey: ['me'] })
    } catch (err) {
      alert(err.response?.data?.error || 'Could not cancel subscription')
    }
  }

  const resetDate = user?.quotaResetAt
    ? new Date(user.quotaResetAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-900 flex flex-col p-4 hidden md:flex">
        <div className="font-bold text-base tracking-tight mb-8">
          Content<span className="text-brand-400">Pilot</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors">
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link to="/history" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 text-sm transition-colors">
            <History size={15} /> History
          </Link>
          <Link to="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium">
            <SettingsIcon size={15} /> Settings
          </Link>
        </nav>
        <div className="border-t border-gray-900 pt-4">
          {user && <QuotaBar user={user} onUpgrade={() => {}} />}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-8">
        <h1 className="text-xl font-bold">Settings</h1>

        {/* Account */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Account</h2>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Name</div>
              <div className="text-sm">{user?.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="text-sm text-gray-400">{user?.email}</div>
            </div>
          </div>
        </section>

        {/* Voice Settings */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Voice Settings</h2>

          <div>
            <div className="text-xs text-gray-500 mb-3">Default voice profile</div>
            <VoiceSelector value={voice} onChange={setVoice} />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              Custom voice prompt
              {user?.tier === 'free' && (
                <span className="flex items-center gap-1 bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                  <Lock size={10} /> Pro
                </span>
              )}
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={user?.tier === 'free'}
              maxLength={500}
              rows={4}
              placeholder={
                user?.tier === 'free'
                  ? 'Upgrade to unlock custom voice training...'
                  : 'Describe your unique voice and style in detail...'
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {user?.tier !== 'free' && (
              <div className="text-xs text-gray-600 mt-1 text-right">{customPrompt.length}/500</div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveVoiceSettings}
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {saveMsg && (
              <span className={`text-sm ${saveMsg === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>
                {saveMsg}
              </span>
            )}
          </div>
        </section>

        {/* Plan & Usage */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Plan & Usage</h2>

          <div className="flex items-center gap-3">
            <span className="bg-brand-500/20 text-brand-300 text-xs font-medium px-3 py-1 rounded-full">
              {TIER_LABELS[user?.tier || 'free']}
            </span>
            <span className="text-sm text-gray-400">
              {user?.quotaUsed ?? 0} / {QUOTA_LIMITS[user?.tier || 'free']} repurposes used this month
            </span>
          </div>

          <div className="text-xs text-gray-600">Quota resets on {resetDate}</div>

          {user?.tier === 'free' ? (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {['solo', 'team', 'scale'].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handleUpgrade(plan)}
                  className="text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-2.5 rounded-lg transition-colors capitalize font-medium"
                >
                  {plan === 'solo' ? '$19 Solo' : plan === 'team' ? '$49 Team' : '$99 Scale'}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={handleCancelSubscription}
              className="text-sm bg-gray-800 hover:bg-red-900/40 border border-gray-700 hover:border-red-800 text-gray-300 hover:text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel subscription
            </button>
          )}
        </section>

        {/* Danger Zone */}
        <section className="bg-gray-900 border border-red-900/30 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Danger Zone</h2>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="text-sm text-red-400 border border-red-800 hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                This will permanently delete your account and all job history. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    try {
                      await api.delete('/api/auth/account')
                      await logout()
                    } catch {
                      alert('Delete failed. Please contact support.')
                    }
                  }}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
