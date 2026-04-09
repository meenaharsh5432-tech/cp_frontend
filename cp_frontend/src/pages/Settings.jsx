import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, History, Settings as SettingsIcon, Lock, LogOut, Zap, Check, Crown } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import VoiceSelector from '../components/VoiceSelector'
import QuotaBar from '../components/QuotaBar'
import api from '../lib/api'

const TIER_LABELS = { free: 'Free', solo: 'Solo', team: 'Team', scale: 'Scale' }
const QUOTA_LIMITS = { free: 3, solo: 30, team: '∞', scale: '∞' }

const PLANS = [
  { id: 'solo', label: 'Solo', price: '$19', desc: '30 repurposes/mo', color: 'border-brand-500/40 hover:border-brand-500' },
  { id: 'team', label: 'Team', price: '$49', desc: 'Unlimited · 3 seats', color: 'border-violet-500/40 hover:border-violet-500' },
  { id: 'scale', label: 'Scale', price: '$99', desc: 'Unlimited · Unlimited seats', color: 'border-purple-500/40 hover:border-purple-500' }
]

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

  useEffect(() => {
    if (window.Razorpay) return
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
  }, [])

  async function handleUpgrade(plan) {
    if (!window.Razorpay) {
      alert('Payment gateway not loaded yet. Please try again.')
      return
    }
    let subscriptionId, keyId
    try {
      const res = await api.post('/api/billing/checkout', { plan })
      subscriptionId = res.data.subscriptionId
      keyId = res.data.keyId
    } catch (err) {
      alert(err.response?.data?.error || 'Could not start checkout')
      return
    }
    const rzp = new window.Razorpay({
      key: keyId,
      subscription_id: subscriptionId,
      name: 'ContentPilot',
      description: `${TIER_LABELS[plan]} Plan`,
      prefill: { name: user?.name, email: user?.email, contact: '' },
      theme: { color: '#4c6ef5' },
      modal: { escape: true, animation: true },
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
          <Link to="/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 text-sm font-medium transition-colors">
            <History size={16} /> History
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-600/15 text-brand-300 text-sm font-semibold border border-brand-500/20">
            <SettingsIcon size={16} /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-900 space-y-4">
          {user && <QuotaBar user={user} onUpgrade={() => {}} />}
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
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>

          {/* Account */}
          <section className="card p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-white">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
              <div className="ml-auto">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  user?.tier === 'free' ? 'bg-gray-800 text-gray-400' : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                }`}>
                  {TIER_LABELS[user?.tier || 'free']}
                </span>
              </div>
            </div>
          </section>

          {/* Voice Settings */}
          <section className="card p-6 space-y-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Voice Settings</h2>

            <div>
              <div className="text-xs text-gray-500 mb-3 font-medium">Default voice profile</div>
              <VoiceSelector value={voice} onChange={setVoice} />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
                Custom voice prompt
                {user?.tier === 'free' && (
                  <span className="flex items-center gap-1 bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-700">
                    <Lock size={9} /> Pro only
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
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 resize-none disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              />
              {user?.tier !== 'free' && (
                <div className="text-xs text-gray-600 mt-1 text-right">{customPrompt.length}/500</div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={saveVoiceSettings}
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/20"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              {saveMsg && (
                <span className={`text-sm flex items-center gap-1.5 ${saveMsg === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>
                  {saveMsg === 'Saved!' && <Check size={14} />}
                  {saveMsg}
                </span>
              )}
            </div>
          </section>

          {/* Plan & Usage */}
          <section className="card p-6 space-y-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan & Usage</h2>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${user?.tier === 'free' ? 'text-gray-300' : 'text-brand-300'}`}>
                    {TIER_LABELS[user?.tier || 'free']} Plan
                  </span>
                  {user?.tier !== 'free' && <Crown size={14} className="text-yellow-400" />}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.quotaUsed ?? 0} / {QUOTA_LIMITS[user?.tier || 'free']} repurposes · resets {resetDate}
                </div>
              </div>
            </div>

            {user?.tier === 'free' ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Upgrade your plan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                      className={`text-left p-4 bg-gray-800/60 hover:bg-gray-800 border ${plan.color} rounded-xl transition-all group`}
                    >
                      <div className="font-bold text-white text-sm mb-0.5">{plan.price}<span className="text-gray-500 font-normal text-xs">/mo</span></div>
                      <div className="text-xs font-semibold text-gray-300 mb-1">{plan.label}</div>
                      <div className="text-xs text-gray-500">{plan.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleCancelSubscription}
                className="text-sm bg-gray-800/60 hover:bg-red-900/30 border border-gray-700 hover:border-red-800/50 text-gray-400 hover:text-red-400 px-4 py-2.5 rounded-xl transition-all"
              >
                Cancel subscription
              </button>
            )}
          </section>

          {/* Danger Zone */}
          <section className="card border-red-900/30 p-6 space-y-4">
            <h2 className="text-xs font-semibold text-red-500/80 uppercase tracking-wider">Danger Zone</h2>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-sm text-red-500/70 border border-red-900/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800 px-4 py-2.5 rounded-xl transition-all"
              >
                Delete my account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  This will permanently delete your account and all job history. This cannot be undone.
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
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-colors font-semibold"
                  >
                    Yes, delete everything
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="text-sm text-gray-500 hover:text-white px-4 py-2.5 rounded-xl transition-colors border border-gray-800 hover:border-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
