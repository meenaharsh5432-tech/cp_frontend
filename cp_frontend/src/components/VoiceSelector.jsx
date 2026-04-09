import { VOICE_PROFILES_FRONTEND } from '../lib/voiceProfiles'

export default function VoiceSelector({ value, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {VOICE_PROFILES_FRONTEND.map((profile) => (
        <button
          key={profile.id}
          onClick={() => onChange(profile.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm ${value === profile.id
              ? 'border-brand-300 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
              : 'border-slate-200 bg-white/60 text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-white'
            }`}
        >
          <span className="text-base">{profile.emoji}</span>
          <span>{profile.name}</span>
        </button>
      ))}
    </div>
  )
}
