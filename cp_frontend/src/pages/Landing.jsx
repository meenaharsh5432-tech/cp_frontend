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
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/10'
  },
  {
    icon: Sparkles,
    title: 'Sparkle voice',
    desc: 'Not just reformatted — rewritten in your exact tone using 4 built-in voice profiles.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/10'
  },
  {
    icon: Globe,
    title: 'Global count',
    desc: 'Blog URL, GitHub README, YouTube video, or raw text — every input type handled.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/10'
  },
  {
    icon: Clock,
    title: 'Clock time',
    desc: 'GPT-4o generates all 4 outputs in parallel. No waiting, no queues, no limits.',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/10'
  }
]

export default function Landing() {
  const [previewVoice, setPreviewVoice] = useState('developer')
  const profile = VOICE_PROFILES_FRONTEND.find((p) => p.id === previewVoice)
  const apiUrl = import.meta.env.VITE_API_URL || ''

  return (
    <div className="min-h-screen bg-[#070b17] text-gray-100 overflow-x-hidden">

      {/* Background radial glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-violet-600/[0.12] blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.08] blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600/[0.10] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#070b17]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base tracking-tight">
            <div className="w-6 h-6 rounded-md bg-violet-600/30 border border-violet-500/30 flex items-center justify-center">
              <BookMarked size={12} className="text-violet-400" />
            </div>
            Content<span className="text-violet-400">Pilot</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Pricing
            </a>
            <a
              href={`${apiUrl}/api/auth/google`}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-lg shadow-violet-700/20"
            >
              Get started free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center pt-28 pb-16 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-violet-500/[0.12] border border-violet-500/[0.18] text-violet-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <Sparkles size={11} /> Powered by GPT-4o · No credit card required
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[1.08]">
          Repurpose content
          <br />
          <span className="hero-gradient-text">in your voice.</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a
            href={`${apiUrl}/api/auth/google`}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-lg shadow-violet-700/30"
          >
            Start for free <ArrowRight size={14} />
          </a>
          <a href="#voices" className="text-sm text-gray-400 hover:text-white transition-colors">
            See voice examples ↓
          </a>
        </div>
      </section>

      {/* Voice preview */}
      <section id="voices" className="max-w-3xl mx-auto px-6 py-16">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Same content. 4 different voices.</h2>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-7">
            {VOICE_PROFILES_FRONTEND.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreviewVoice(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  previewVoice === p.id
                    ? 'bg-violet-600/30 border border-violet-500/50 text-violet-200'
                    : 'border border-white/[0.08] text-gray-400 hover:border-white/[0.16] hover:text-gray-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Tweet card */}
          <div className="glass-card-inner p-5 max-w-md mx-auto">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/25 flex items-center justify-center text-violet-400 font-mono text-sm font-bold shrink-0">
                {profile.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-white">{profile.name}</span>
                    <span className="text-xs text-gray-500 ml-2">@{profile.id} · 1mo</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
                    <Twitter size={10} className="text-sky-400" />
                    <span className="text-xs text-sky-400 font-medium">Thread</span>
                  </div>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mt-2 whitespace-pre-line">{profile.sampleTweet}</p>
                <p className="text-xs text-violet-400/70 mt-2">twitter.com/ContentPilot...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Built for speed, built for voice</h2>
          <p className="text-sm text-gray-500">Everything you need to distribute content across platforms without sounding like a robot.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className={`glass-card p-5 hover:border-white/[0.12] transition-colors`}>
                <div className={`w-10 h-10 ${f.bg} border ${f.border} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={18} className={f.color} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5 text-white">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Simple, transparent pricing</h2>
          <p className="text-sm text-gray-500">Start free. Upgrade only when you need more.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-5 border transition-all ${
                plan.highlight
                  ? 'border-violet-500/40 bg-violet-500/[0.07] shadow-xl shadow-violet-900/20'
                  : 'glass-card hover:border-white/[0.12]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Meet popular
                </div>
              )}
              <div className="text-xs text-gray-500 mb-3 font-medium">{plan.desc}</div>
              <div className="font-bold text-base mb-0.5 text-white">{plan.name}</div>
              <div className="mb-5 flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-500 text-xs">{plan.period}</span>}
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                    <Check size={12} className="text-violet-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`${apiUrl}/api/auth/google`}
                className={`block text-center text-xs font-semibold py-2.5 rounded-xl transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-md shadow-violet-700/20'
                    : 'bg-white/[0.06] hover:bg-white/[0.09] text-gray-300 border border-white/[0.08]'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="glass-card p-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to repurpose smarter?</h2>
          <p className="text-sm text-gray-500 mb-8">Get start lighting, vocations and throughout.</p>
          <a
            href={`${apiUrl}/api/auth/google`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all shadow-lg shadow-violet-700/30"
          >
            Start for free <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 text-center text-sm text-gray-600">
        <span className="font-semibold text-gray-500">Content<span className="text-violet-400">Pilot</span></span>
        <span className="mx-3">·</span>
        Built for creators who ship
      </footer>
    </div>
  )
}
