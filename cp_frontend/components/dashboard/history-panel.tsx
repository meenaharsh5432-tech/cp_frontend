"use client"

import { Clock, Sparkles, Trash2 } from "lucide-react"
import { JobListItem, api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface HistoryPanelProps {
  items: JobListItem[]
  onSelect: (item: JobListItem) => void
  onDeleted: (id: string) => void
}

function inputTypeLabel(type: string) {
  switch (type) {
    case "youtube": return "YouTube"
    case "url": return "URL"
    case "text": return "Topic"
    case "readme": return "README"
    default: return type
  }
}

export function HistoryPanel({ items, onSelect, onDeleted }: HistoryPanelProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await api.jobs.delete(id)
      onDeleted(id)
    } catch {
      // ignore
    } finally {
      setDeletingId(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">History</h2>
        </div>
        <div className="p-6 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No content generated yet</p>
          <p className="text-xs text-muted-foreground mt-1">Your generated content will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">History</h2>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => item.status === 'completed' && onSelect(item)}
            className={`w-full rounded-xl border border-border/50 bg-secondary/30 p-4 text-left hover:border-primary/50 hover:bg-secondary/50 transition-all ${item.status !== 'completed' ? 'opacity-60 cursor-default' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {item.shortHook ? item.shortHook.slice(0, 50) + (item.shortHook.length > 50 ? '…' : '') : item.inputUrl || 'Untitled'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={deletingId === item.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {inputTypeLabel(item.inputType)}
                  </span>
                  {item.status !== 'completed' && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                      {item.status}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
