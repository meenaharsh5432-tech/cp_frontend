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
  { id: 'solo',  label: 'Solo',  price: '$19', desc: '30 repurposes/mo',          color: 'border-brand-300 hover:border-brand-500 hover:shadow-glass' },
  { id: 'team',  label: 'Team',  price: '$49', desc: 'Unlimited · 3 seats',        color: 'border-violet-300 hover:border-violet-500 hover:shadow-glass' },
  { id: 'scale', label: 'Scale', price: '$99', desc: 'Unlimited · Unlimited seats', color: 'border-purple-300 hover:border-purple-500 hover:shadow-glass' }
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 text-sm font-semibold transition-all"
          >
            <History size={18} /> History
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-bold border border-brand-200/50 shadow-sm transition-all"
          >
            <SettingsIcon size={18} className="text-brand-600" /> Settings
          </Link>
        </nav>
        <div className="p-5 border-t border-white/60 space-y-5 bg-white/30 backdrop-blur-md">
          {user && <QuotaBar user={user} onUpgrade={() => {}} />}
          {user?.tier === 'free' && (
            <button
              onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 w-full text-sm bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 text-brand-700 hover:shadow-md py-3 rounded-xl transition-all font-bold hover:-translate-y-0.5 hover:from-white hover:to-white"
            >
              <Zap size={14} className="text-amber-500" /> Upgrade plan
            </button>
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
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

          {/* Header */}
          <div className="glass-card p-6 border-l-4 border-l-brand-500">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
            <p className="text-base text-slate-600 mt-2 font-medium">Manage your account, voice, and billing.</p>
          </div>

          {/* Account */}
          <section className="glass-card p-6 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900">{user?.name}</div>
                <div className="text-sm text-slate-500">{user?.email}</div>
              </div>
              <div className="ml-auto">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  user?.tier === 'free'
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : 'bg-brand-50 text-brand-700 border-brand-200'
                }`}>
                  {TIER_LABELS[user?.tier || 'free']}
                </span>
              </div>
            </div>
          </section>

          {/* Voice Settings */}
          <section className="glass-card p-6 space-y-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Voice Settings</h2>

            <div>
              <div className="text-xs text-slate-500 mb-3 font-semibold">Default voice profile</div>
              <VoiceSelector value={voice} onChange={setVoice} />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-semibold">
                Custom voice prompt
                {user?.tier === 'free' && (
                  <span className="flex items-center gap-1 bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
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
                className="glass-input resize-none disabled:opacity-40 disabled:cursor-not-allowed"
              />
              {user?.tier !== 'free' && (
                <div className="text-xs text-slate-400 mt-1 text-right">{customPrompt.length}/500</div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={saveVoiceSettings}
                disabled={saving}
                className="bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              {saveMsg && (
                <span className={`text-sm flex items-center gap-1.5 font-medium ${saveMsg === 'Saved!' ? 'text-green-600' : 'text-red-500'}`}>
                  {saveMsg === 'Saved!' && <Check size={14} />}
                  {saveMsg}
                </span>
              )}
            </div>
          </section>

          {/* Plan & Usage */}
          <section id="plans-section" className="glass-card p-6 space-y-5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan & Usage</h2>

            <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${user?.tier === 'free' ? 'text-slate-700' : 'text-brand-700'}`}>
                    {TIER_LABELS[user?.tier || 'free']} Plan
                  </span>
                  {user?.tier !== 'free' && <Crown size={14} className="text-amber-500" />}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {user?.quotaUsed ?? 0} / {QUOTA_LIMITS[user?.tier || 'free']} repurposes · resets {resetDate}
                </div>
              </div>
            </div>

            {user?.tier === 'free' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Upgrade your plan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                      className={`text-left p-4 bg-white/60 hover:bg-white/90 border ${plan.color} rounded-xl transition-all`}
                    >
                      <div className="font-black text-slate-900 text-sm mb-0.5">
                        {plan.price}<span className="text-slate-400 font-normal text-xs">/mo</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 mb-1">{plan.label}</div>
                      <div className="text-xs text-slate-500">{plan.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleCancelSubscription}
                className="text-sm bg-white/60 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-500 px-4 py-2.5 rounded-xl transition-all font-medium"
              >
                Cancel subscription
              </button>
            )}
          </section>

          {/* Danger Zone */}
          <section className="glass-card border-red-200/60 p-6 space-y-4">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Danger Zone</h2>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-sm text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 px-4 py-2.5 rounded-xl transition-all font-medium"
              >
                Delete my account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 font-medium">
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
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl transition-colors font-semibold"
                  >
                    Yes, delete everything
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl transition-colors border border-slate-200 hover:border-slate-300 bg-white/60 font-medium"
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
