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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-2 bg-slate-100/60 p-1.5 rounded-2xl border border-white/80 backdrop-blur-md shadow-inner">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => { setActiveTab(t.id); setValue('') }}
              className={`flex items-center gap-2 flex-1 justify-center py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-white text-brand-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                }`}
            >
              <Icon size={16} className={isActive ? 'text-brand-500' : 'text-slate-400'} />
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
          className="glass-input resize-none"
          disabled={isLoading}
        />
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={tab.placeholder}
          className="glass-input"
          disabled={isLoading}
        />
      )}

      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="w-full btn-primary py-3.5 text-base"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full" />
            Repurposing...
          </>
        ) : (
          <>
            Repurpose content
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  )
}
