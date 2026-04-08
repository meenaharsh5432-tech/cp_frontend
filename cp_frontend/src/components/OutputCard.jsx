import { useState, useRef } from 'react'
import { Copy, Check, Twitter, Linkedin, Mail, Zap } from 'lucide-react'

const FORMATS = [
  { id: 'twitterThread', label: 'Twitter Thread', icon: Twitter, color: 'text-sky-400' },
  { id: 'linkedinPost', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
  { id: 'newsletter', label: 'Newsletter', icon: Mail, color: 'text-purple-400' },
  { id: 'shortHook', label: 'Hook', icon: Zap, color: 'text-yellow-400' }
]

function countWords(str) {
  return str?.trim().split(/\s+/).filter(Boolean).length ?? 0
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
    >
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function OutputCard({ job }) {
  const [activeTab, setActiveTab] = useState('twitterThread')

  if (!job) return null

  const activeFormat = FORMATS.find((f) => f.id === activeTab)
  const content = job[activeTab] || ''
  const wordCount = countWords(content)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Format tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {FORMATS.map((fmt) => {
          const Icon = fmt.icon
          return (
            <button
              key={fmt.id}
              onClick={() => setActiveTab(fmt.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === fmt.id
                  ? `border-brand-500 text-white bg-gray-800/50`
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon size={14} className={activeTab === fmt.id ? fmt.color : ''} />
              {fmt.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{wordCount} words · {content.length} chars</span>
          <CopyButton text={content} />
        </div>

        {/* Editable output */}
        <div
          contentEditable
          suppressContentEditableWarning
          className="min-h-[160px] text-sm text-gray-200 leading-relaxed whitespace-pre-wrap outline-none focus:ring-1 focus:ring-brand-500/50 rounded-lg p-1 -m-1"
          onBlur={(e) => {
            // Content is editable in-place; no save needed unless user explicitly requests
          }}
        >
          {content}
        </div>
      </div>
    </div>
  )
}
