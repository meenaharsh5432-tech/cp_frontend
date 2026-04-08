import { Trash2, ExternalLink, Clock, Loader2 } from 'lucide-react'
import { useDeleteJob } from '../hooks/useJobs'

const TYPE_LABELS = {
  url: 'Blog URL',
  readme: 'GitHub README',
  youtube: 'YouTube',
  text: 'Custom Text'
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
      <div className="text-center py-16 text-gray-500">
        <Clock size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No repurposes yet. Create your first one above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                {TYPE_LABELS[job.inputType] || job.inputType}
              </span>
              <span className="text-xs text-gray-500">
                {VOICE_EMOJIS[job.voiceProfile]} {job.voiceProfile}
              </span>
              {job.status === 'processing' && (
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Loader2 size={10} className="animate-spin" />
                  Processing
                </span>
              )}
              {job.status === 'failed' && (
                <span className="text-xs text-red-400">Failed</span>
              )}
            </div>

            {job.shortHook ? (
              <p className="text-sm text-gray-300 truncate">{job.shortHook}</p>
            ) : job.inputUrl ? (
              <p className="text-xs text-gray-500 truncate">{job.inputUrl}</p>
            ) : null}

            <p className="text-xs text-gray-600 mt-1">{formatDate(job.createdAt)}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {job.status === 'completed' && (
              <button
                onClick={() => onSelect(job.id)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-800"
                title="View"
              >
                <ExternalLink size={14} />
              </button>
            )}
            <button
              onClick={() => deleteJob.mutate(job.id)}
              disabled={deleteJob.isPending}
              className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded hover:bg-gray-800"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
