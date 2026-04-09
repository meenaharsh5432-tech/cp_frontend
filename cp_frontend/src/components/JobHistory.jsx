import { Trash2, ExternalLink, Clock, Loader2, Link2, BookOpen, Youtube, FileText } from 'lucide-react'
import { useDeleteJob } from '../hooks/useJobs'

const TYPE_CONFIG = {
  url: { label: 'Blog URL', icon: Link2, color: 'text-green-400', bg: 'bg-green-400/10' },
  readme: { label: 'GitHub README', icon: BookOpen, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  youtube: { label: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-400/10' },
  text: { label: 'Custom Text', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' }
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
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-gray-800/60 flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-gray-600" />
        </div>
        <p className="text-sm font-medium text-gray-400 mb-1">No repurposes yet</p>
        <p className="text-xs text-gray-600">Go to Dashboard and create your first one.</p>
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
            className="card p-4 hover:border-gray-700 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Type icon */}
              <div className={`w-9 h-9 rounded-xl ${typeConfig.bg} flex items-center justify-center shrink-0`}>
                <TypeIcon size={15} className={typeConfig.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-xs font-medium ${typeConfig.color} ${typeConfig.bg} px-2 py-0.5 rounded-full`}>
                    {typeConfig.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {VOICE_EMOJIS[job.voiceProfile]} {job.voiceProfile}
                  </span>
                  {job.status === 'processing' && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                      <Loader2 size={10} className="animate-spin" /> Processing
                    </span>
                  )}
                  {job.status === 'failed' && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Failed</span>
                  )}
                </div>

                {job.shortHook ? (
                  <p className="text-sm text-gray-300 truncate leading-relaxed">{job.shortHook}</p>
                ) : job.inputUrl ? (
                  <p className="text-xs text-gray-500 truncate">{job.inputUrl}</p>
                ) : (
                  <p className="text-xs text-gray-600 italic">Custom text input</p>
                )}

                <p className="text-xs text-gray-700 mt-1.5">{formatDate(job.createdAt)}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {job.status === 'completed' && (
                  <button
                    onClick={() => onSelect(job.id)}
                    className="p-1.5 text-gray-500 hover:text-brand-400 transition-colors rounded-lg hover:bg-gray-800"
                    title="View outputs"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
                <button
                  onClick={() => deleteJob.mutate(job.id)}
                  disabled={deleteJob.isPending}
                  className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
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
