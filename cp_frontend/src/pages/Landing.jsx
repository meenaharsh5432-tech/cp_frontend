import { useState } from 'react'
import { Zap, Check, Twitter, Linkedin, Mail } from 'lucide-react'
import { VOICE_PROFILES_FRONTEND } from '../lib/voiceProfiles'

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['3 repurposes/month', 'All 4 output formats', '4 voice profiles', 'Job history'],
    cta: 'Start free',
    highlight: false
  },
  {
    name: 'Solo',
    price: '$19',
    period: '/mo',
    features: ['30 repurposes/month', 'All 4 output formats', '4 voice profiles', 'Custom voice prompt', 'Priority support'],
    cta: 'Get Solo',
    highlight: true
  },
  {
    name: 'Team',
    price: '$49',
    period: '/mo',
    features: ['Unlimited repurposes', '3 team seats', 'Custom voice prompt', 'All platforms', 'Priority support'],
    cta: 'Get Team',
    highlight: false
  },
  {
    name: 'Scale',
    price: '$99',
    period: '/mo',
    features: ['Unlimited repurposes', 'Unlimited seats', 'Custom voice training', 'API access', 'Dedicated support'],
    cta: 'Get Scale',
    highlight: false
  }
]

const FEATURES = [
  { icon: Zap, title: '4 voice profiles built in', desc: 'Developer, Creator, Founder, Marketing — pick your voice once.' },
  { icon: Twitter, title: 'Twitter thread generator', desc: '8-12 numbered tweets, optimised for engagement.' },
  { icon: Linkedin, title: 'LinkedIn post writer', desc: 'Professional, short paragraphs, always ends with a CTA.' },
  { icon: Mail, title: 'Newsletter snippets', desc: 'Inbox-ready copy in under 120 words.' }
]

export default function Landing() {
  const [previewVoice, setPreviewVoice] = useState('developer')
  const profile = VOICE_PROFILES_FRONTEND.find((p) => p.id === previewVoice)

  const apiUrl = import.meta.env.VITE_API_URL || ''

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Nav */}
      <nav className="border-b border-gray-900 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="font-bold text-lg tracking-tight">
          Content<span className="text-brand-400">Pilot</span>
        </div>
        <a
          href={`${apiUrl}/api/auth/google`}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Start free
        </a>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Zap size={12} /> No credit card required
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Your content.{' '}
          <span className="text-brand-400">Your voice.</span>{' '}
          Every platform.
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Paste a blog post, video, or README. ContentPilot repurposes it into Twitter threads,
          LinkedIn posts, and newsletters — written exactly in your voice.
        </p>
        <a
          href={`${apiUrl}/api/auth/google`}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
        >
          Start free — no credit card
        </a>
      </section>

      {/* Voice preview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-3">Same content, 4 different voices</h2>
        <p className="text-gray-400 text-center mb-10">Click each voice to see how the same content changes</p>

        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {VOICE_PROFILES_FRONTEND.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreviewVoice(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                previewVoice === p.id
                  ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                  : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
              }`}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-400">
            <span>{profile.emoji}</span>
            <span>{profile.name} voice</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-600">Twitter thread preview</span>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{profile.sampleTweet}</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-900">
        <h2 className="text-2xl font-bold text-center mb-12">Everything you need to repurpose faster</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <Icon size={20} className="text-brand-400 mb-3" />
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-900">
        <h2 className="text-2xl font-bold text-center mb-3">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-12">Start free. Upgrade when you need more.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-5 border ${
                plan.highlight
                  ? 'border-brand-500 bg-brand-500/5'
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-medium text-brand-400 mb-2">Most popular</div>
              )}
              <div className="font-bold text-xl mb-0.5">{plan.name}</div>
              <div className="mb-5">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={13} className="text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`${apiUrl}/api/auth/google`}
                className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                  plan.highlight
                    ? 'bg-brand-600 hover:bg-brand-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 text-center text-sm text-gray-600">
        ContentPilot · Built for creators who ship
      </footer>
    </div>
  )
}
