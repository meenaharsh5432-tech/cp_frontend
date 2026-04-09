import { useState } from 'react'
import { Link2, BookOpen, Youtube, FileText, ArrowRight } from 'lucide-react'

const TABS = [
  { id: 'url', label: 'URL', icon: Link2, placeholder: 'https://yourblog.com/your-post' },
  { id: 'readme', label: 'README', icon: BookOpen, placeholder: 'https://github.com/user/repo' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/watch?v=...' },
  { id: 'text', label: 'Text', icon: FileText, placeholder: 'Paste your content here...' }
]

export default function InputTabs({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('url')
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim() || isLoading) return
    onSubmit({ inputType: activeTab, input: value.trim() })
  }

  const tab = TABS.find((t) => t.id === activeTab)

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-800/60 p-1 rounded-xl">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => { setActiveTab(t.id); setValue('') }}
              className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-brand-400' : ''} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Input */}
      {activeTab === 'text' ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={tab.placeholder}
          rows={7}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 resize-none transition-all"
          disabled={isLoading}
        />
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={tab.placeholder}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
          disabled={isLoading}
        />
      )}

      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25 flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white rounded-full" />
            Repurposing...
          </>
        ) : (
          <>
            Repurpose content
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  )
}
