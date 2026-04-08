import { VOICE_PROFILES_FRONTEND } from '../lib/voiceProfiles'

export default function VoiceSelector({ value, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {VOICE_PROFILES_FRONTEND.map((profile) => (
        <button
          key={profile.id}
          onClick={() => onChange(profile.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
            value === profile.id
              ? 'border-brand-500 bg-brand-500/10 text-brand-400'
              : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
          }`}
        >
          <span>{profile.emoji}</span>
          <span>{profile.name}</span>
        </button>
      ))}
    </div>
  )
}
