import { useState } from 'react'
import { Zap, Check, Twitter, ArrowRight, Sparkles, Globe, Clock, BookMarked } from 'lucide-react'
import { VOICE_PROFILES_FRONTEND } from '../lib/voiceProfiles'

const PRICING = [
  {
    name: 'Free',
    price: 'Free',
    period: '',
    desc: 'Get top to the Free',
    features: ['3 repurposes/month', 'All 4 output formats', '4 voice profiles', 'Job history'],
    cta: 'Get started',
    highlight: false
  },
  {
    name: 'Solo',
    price: '$10',
    period: '/mo',
    desc: 'Simple customers pro features',
    features: ['30 repurposes/month', 'All 4 output formats', '4 voice profiles', 'Custom voice prompt', 'Priority support'],
    cta: 'Get started',
    highlight: true
  },
  {
    name: 'Team',
    price: '$20',
    period: '/mo',
    desc: 'Well-link customers workload',
    features: ['Unlimited repurposes', '3 team seats', 'Custom voice prompt', 'All platforms', 'Priority support'],
    cta: 'Get started',
    highlight: false
  },
  {
    name: 'Scale',
    price: '$40',
    period: '/mo',
    desc: 'Complete customers teamwork',
    features: ['Unlimited repurposes', 'Unlimited seats', 'Custom voice training', 'API access', 'Dedicated support'],
    cta: 'Get started',
    highlight: false
  }
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Lighting speed',
    desc: 'Paste one piece of content and get all 4 formats generated in under 30 seconds.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200'
  },
  {
    icon: Sparkles,
    title: 'Sparkle voice',
    desc: 'Not just reformatted — rewritten in your exact tone using 4 built-in voice profiles.',
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    border: 'border-violet-200'
  },
  {
    icon: Globe,
    title: 'Global count',
    desc: 'Blog URL, GitHub README, YouTube video, or raw text — every input type handled.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200'
  },
  {
    icon: Clock,
    title: 'Clock time',
    desc: 'GPT-4o generates all 4 outputs in parallel. No waiting, no queues, no limits.',
    color: 'text-sky-600',
    bg: 'bg-sky-100',
    border: 'border-sky-200'
  }
]

export default function Landing() {
  const [previewVoice, setPreviewVoice] = useState('developer')
  const profile = VOICE_PROFILES_FRONTEND.find((p) => p.id === previewVoice)
  const apiUrl = import.meta.env.VITE_API_URL || ''

  return (
    <div className="min-h-screen text-slate-900 overflow-x-hidden relative">

      {/* Floating Background Orbs for Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[5%] left-[25%] w-[600px] h-[600px] rounded-full bg-violet-400/20 blur-[120px] animate-float opacity-70" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-float opacity-70" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-[100px] animate-float opacity-70" style={{ animationDelay: '4s' }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 glass-nav">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-base tracking-tight text-slate-800">
            <div className="w-6 h-6 rounded-md bg-brand-100 border border-brand-200 flex items-center justify-center shadow-sm">
              <BookMarked size={12} className="text-brand-600" />
            </div>
            Content<span className="text-brand-600">Pilot</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors hidden sm:block">
              Pricing
            </a>
            <a
              href={`${apiUrl}/api/auth/google`}
              className="btn-primary"
            >
              Get started free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center pt-28 pb-16 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <Sparkles size={11} className="text-brand-500" /> Powered by GPT-4o · No credit card required
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[1.08] text-slate-900">
          Repurpose content
          <br />
          <span className="hero-gradient-text">in your voice.</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a
            href={`${apiUrl}/api/auth/google`}
            className="btn-primary py-3.5 px-8 text-base"
          >
            Start for free <ArrowRight size={16} />
          </a>
          <a href="#voices" className="btn-secondary py-3.5 px-6">
            See voice examples ↓
          </a>
        </div>
      </section>

      {/* Voice preview */}
      <section id="voices" className="max-w-3xl mx-auto px-6 py-16">
        <div className="glass-card p-8 group">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Same content. 4 different voices.</h2>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-7">
            {VOICE_PROFILES_FRONTEND.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreviewVoice(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${previewVoice === p.id
                    ? 'bg-brand-500 text-white shadow-brand-500/30'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
                  }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Tweet card */}
          <div className="glass-card-inner bg-white/70 p-5 max-w-md mx-auto shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-600 font-mono text-sm font-bold shrink-0 shadow-sm">
                {profile.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{profile.name}</span>
                    <span className="text-xs text-slate-500 ml-2">@{profile.id} · 1mo</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
                    <Twitter size={10} className="text-sky-500" />
                    <span className="text-xs text-sky-600 font-semibold">Thread</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-line font-medium">{profile.sampleTweet}</p>
                <p className="text-xs text-brand-500/80 mt-2 font-medium">twitter.com/ContentPilot...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Built for speed, built for voice</h2>
          <p className="text-sm text-slate-600 font-medium">Everything you need to distribute content across platforms without sounding like a robot.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="glass-card p-6 transition-all duration-300">
                <div className={`w-12 h-12 ${f.bg} border ${f.border} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon size={22} className={f.color} />
                </div>
                <h3 className="font-bold text-base mb-2 text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Simple, transparent pricing</h2>
          <p className="text-sm text-slate-600 font-medium">Start free. Upgrade only when you need more.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 transition-all duration-300 ${plan.highlight
                  ? 'glass-card border-brand-300 transform scale-105 shadow-glow z-10'
                  : 'glass-card'
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                  Most popular
                </div>
              )}
              <div className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wide">{plan.desc}</div>
              <div className="font-black text-lg mb-1 text-slate-900">{plan.name}</div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500 text-sm font-medium">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                    <Check size={16} className="text-brand-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`${apiUrl}/api/auth/google`}
                className={`w-full ${plan.highlight
                    ? 'btn-primary'
                    : 'btn-secondary'
                  }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="glass-card p-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-100/40 to-violet-100/40 z-0" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Ready to repurpose smarter?</h2>
            <p className="text-base text-slate-600 mb-8 font-medium">Get started effortlessly. AI generation in your voice.</p>
            <a
              href={`${apiUrl}/api/auth/google`}
              className="btn-primary inline-flex text-base py-3.5 px-8"
            >
              Start for free <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm font-medium text-slate-500 glass-nav">
        <span className="font-bold text-slate-700">Content<span className="text-brand-600">Pilot</span></span>
        <span className="mx-3">·</span>
        Built for creators who ship
      </footer>
    </div>
  )
}
