import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Check } from 'lucide-react'
import api from '../lib/api'
import { VOICE_PROFILES_FRONTEND } from '../lib/voiceProfiles'

const CONTENT_TYPES = [
  'Blog posts',
  'YouTube videos',
  'GitHub projects',
  'Podcasts',
  'Twitter threads',
  'Other'
]

export default function Onboarding() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(1)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [contentTypes, setContentTypes] = useState([])
  const [saving, setSaving] = useState(false)

  function toggleContentType(type) {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  async function handleFinish() {
    if (!selectedVoice) return
    setSaving(true)
    try {
      await api.patch('/api/voice', { voiceProfile: selectedVoice })
      await api.patch('/api/auth/onboarding-complete')
      queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-bold text-xl tracking-tight mb-1">
            Content<span className="text-brand-400">Pilot</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-brand-500 w-8' : 'bg-gray-700 w-4'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1 — Voice */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-2">Choose your voice</h1>
            <p className="text-gray-400 text-center mb-8 text-sm">
              This determines how all your content sounds. You can change it anytime.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {VOICE_PROFILES_FRONTEND.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedVoice(profile.id)}
                  className={`text-left p-5 rounded-xl border transition-all ${
                    selectedVoice === profile.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{profile.emoji}</div>
                  <div className="font-semibold mb-1">{profile.name}</div>
                  <div className="text-xs text-gray-400 mb-3">{profile.description}</div>
                  <div className="text-xs text-gray-500 italic leading-relaxed border-t border-gray-800 pt-3">
                    "{profile.sampleTweet.slice(0, 100)}..."
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedVoice}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Content types */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-2">What do you create?</h1>
            <p className="text-gray-400 text-center mb-8 text-sm">
              Select all that apply. This helps us tailor your experience.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CONTENT_TYPES.map((type) => {
                const selected = contentTypes.includes(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleContentType(type)}
                    className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                      selected
                        ? 'border-brand-500 bg-brand-500/10 text-white'
                        : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        selected ? 'border-brand-500 bg-brand-500' : 'border-gray-600'
                      }`}
                    >
                      {selected && <Check size={10} />}
                    </div>
                    {type}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setStep(3)}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3 — Ready */}
        {step === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-6">
              {VOICE_PROFILES_FRONTEND.find((p) => p.id === selectedVoice)?.emoji}
            </div>
            <h1 className="text-2xl font-bold mb-3">ContentPilot is ready</h1>
            <p className="text-gray-400 mb-2">
              Your voice is set to{' '}
              <span className="text-brand-400 font-medium">
                {VOICE_PROFILES_FRONTEND.find((p) => p.id === selectedVoice)?.name}
              </span>
              .
            </p>
            <p className="text-gray-500 text-sm mb-10">
              Paste any blog post, YouTube video, or README to get started.
            </p>
            <button
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors"
            >
              {saving ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : null}
              Go to dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
