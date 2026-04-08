import { useState } from 'react'
import { Link2, BookOpen, Youtube, FileText } from 'lucide-react'

const TABS = [
  { id: 'url', label: 'URL', icon: Link2, placeholder: 'https://yourblog.com/post' },
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
      <div className="flex gap-1 bg-gray-900 p-1 rounded-lg">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTab(t.id)
                setValue('')
              }}
              className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-gray-800 text-white shadow'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={14} />
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
          rows={8}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
          disabled={isLoading}
        />
      ) : (
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={tab.placeholder}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500"
          disabled={isLoading}
        />
      )}

      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Repurposing...
          </>
        ) : (
          'Repurpose →'
        )}
      </button>
    </form>
  )
}
