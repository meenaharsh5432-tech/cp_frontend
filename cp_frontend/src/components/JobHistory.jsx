import { Trash2, ExternalLink, Clock, Loader2, Link2, BookOpen, Youtube, FileText } from 'lucide-react'
import { useDeleteJob } from '../hooks/useJobs'

const TYPE_CONFIG = {
  url:     { label: 'Blog URL',       icon: Link2,     color: 'text-green-600',  bg: 'bg-green-50  border-green-200/60' },
  readme:  { label: 'GitHub README',  icon: BookOpen,  color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200/60' },
  youtube: { label: 'YouTube',        icon: Youtube,   color: 'text-red-600',    bg: 'bg-red-50    border-red-200/60' },
  text:    { label: 'Custom Text',    icon: FileText,  color: 'text-blue-600',   bg: 'bg-blue-50   border-blue-200/60' }
}

const VOICE_EMOJIS = {
  developer: '⚡',
  creator: '🎯',
  founder: '🚀',
  marketing: '📣'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function JobHistory({ jobs, onSelect }) {
  const deleteJob = useDeleteJob()

  if (!jobs?.length) {
    return (
      <div className="glass-card p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-600 mb-1">No repurposes yet</p>
        <p className="text-xs text-slate-400">Go to Dashboard and create your first one.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const typeConfig = TYPE_CONFIG[job.inputType] || TYPE_CONFIG.url
        const TypeIcon = typeConfig.icon

        return (
          <div
            key={job.id}
            className="glass-card p-4 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Type icon */}
              <div className={`w-9 h-9 rounded-xl border ${typeConfig.bg} flex items-center justify-center shrink-0`}>
                <TypeIcon size={15} className={typeConfig.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-xs font-semibold ${typeConfig.color} px-2 py-0.5 rounded-full border ${typeConfig.bg}`}>
                    {typeConfig.label}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {VOICE_EMOJIS[job.voiceProfile]} {job.voiceProfile}
                  </span>
                  {job.status === 'processing' && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full font-medium">
                      <Loader2 size={10} className="animate-spin" /> Processing
                    </span>
                  )}
                  {job.status === 'failed' && (
                    <span className="text-xs text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-full font-medium">Failed</span>
                  )}
                </div>

                {job.shortHook ? (
                  <p className="text-sm text-slate-700 truncate leading-relaxed font-medium">{job.shortHook}</p>
                ) : job.inputUrl ? (
                  <p className="text-xs text-slate-500 truncate">{job.inputUrl}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">Custom text input</p>
                )}

                <p className="text-xs text-slate-400 mt-1.5 font-medium">{formatDate(job.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {job.status === 'completed' && (
                  <button
                    onClick={() => onSelect(job.id)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all rounded-lg"
                    title="View outputs"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
                <button
                  onClick={() => deleteJob.mutate(job.id)}
                  disabled={deleteJob.isPending}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
