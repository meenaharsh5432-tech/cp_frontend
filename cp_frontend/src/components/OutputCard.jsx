import { useState } from 'react'
import { Copy, Check, Twitter, Linkedin, Mail, Zap } from 'lucide-react'

const FORMATS = [
  {
    id: 'twitterThread',
    label: 'Twitter Thread',
    icon: Twitter,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/30',
    activeBg: 'bg-sky-400/10'
  },
  {
    id: 'linkedinPost',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    activeBg: 'bg-blue-400/10'
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    icon: Mail,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/30',
    activeBg: 'bg-violet-400/10'
  },
  {
    id: 'shortHook',
    label: 'Hook',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    activeBg: 'bg-yellow-400/10'
  }
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
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
        copied
          ? 'bg-green-500/15 border border-green-500/30 text-green-400'
          : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white'
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
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
    <div className="card overflow-hidden">
      {/* Format tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-thin bg-gray-900/40">
        {FORMATS.map((fmt) => {
          const Icon = fmt.icon
          const isActive = activeTab === fmt.id
          return (
            <button
              key={fmt.id}
              onClick={() => setActiveTab(fmt.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? `border-current ${fmt.color} bg-gray-800/60`
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              <Icon size={13} />
              {fmt.label}
            </button>
          )
        })}
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className={`flex items-center gap-2 text-xs font-medium ${activeFormat.color} ${activeFormat.bg} px-2.5 py-1 rounded-full border ${activeFormat.border}`}>
          <activeFormat.icon size={11} />
          {activeFormat.label}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">{wordCount} words</span>
          <CopyButton text={content} />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        <div
          contentEditable
          suppressContentEditableWarning
          className="min-h-[180px] text-sm text-gray-200 leading-relaxed whitespace-pre-wrap outline-none focus:ring-1 focus:ring-brand-500/30 rounded-xl p-3 -mx-3 transition-all"
        >
          {content}
        </div>
      </div>
    </div>
  )
}
