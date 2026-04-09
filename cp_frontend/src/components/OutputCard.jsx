import { useState } from 'react'
import { Copy, Check, Twitter, Linkedin, Mail, Zap } from 'lucide-react'

const FORMATS = [
  {
    id: 'twitterThread',
    label: 'Twitter Thread',
    icon: Twitter,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    activeBg: 'bg-sky-50'
  },
  {
    id: 'linkedinPost',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBg: 'bg-blue-50'
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    icon: Mail,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    activeBg: 'bg-violet-50'
  },
  {
    id: 'shortHook',
    label: 'Hook',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-amber-50'
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
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all border shadow-sm ${copied
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
        }`}
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
      {copied ? 'Copied!' : 'Copy text'}
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
    <div className="glass-card-inner bg-white/70 shadow-sm overflow-hidden flex flex-col">
      {/* Format tabs */}
      <div className="flex border-b border-slate-200/60 overflow-x-auto scrollbar-thin bg-slate-50/50 backdrop-blur-sm">
        {FORMATS.map((fmt) => {
          const Icon = fmt.icon
          const isActive = activeTab === fmt.id
          return (
            <button
              key={fmt.id}
              onClick={() => setActiveTab(fmt.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-[3px] ${isActive
                  ? `border-current ${fmt.color} bg-white shadow-sm`
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/40'
                }`}
            >
              <Icon size={15} />
              {fmt.label}
            </button>
          )
        })}
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className={`flex items-center gap-2 text-xs font-bold ${activeFormat.color} ${activeFormat.bg} px-3 py-1.5 rounded-full border ${activeFormat.border} shadow-sm`}>
          <activeFormat.icon size={13} />
          {activeFormat.label}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{wordCount} words</span>
          <CopyButton text={content} />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div
          contentEditable
          suppressContentEditableWarning
          className="min-h-[220px] text-sm text-slate-800 leading-relaxed whitespace-pre-wrap outline-none focus:ring-2 focus:ring-brand-500/30 rounded-xl p-4 -mx-4 transition-all bg-white/40 hover:bg-white/60 focus:bg-white"
        >
          {content}
        </div>
      </div>
    </div>
  )
}
