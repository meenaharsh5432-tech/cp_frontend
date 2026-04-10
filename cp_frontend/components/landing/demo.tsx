"use client"

import { ArrowRight, Play, Instagram, Hash, ListChecks } from "lucide-react"

export function Demo() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            See the Transformation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how ContentPilot transforms your input into polished, platform-ready content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Input Side */}
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-foreground">Input</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Play className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">YouTube Video</div>
                    <div className="text-sm text-muted-foreground">Source content</div>
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 font-mono text-sm text-muted-foreground">
                  &quot;YouTube video about productivity habits&quot;
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-px w-12 bg-border" />
                  <ArrowRight className="h-5 w-5" />
                  <div className="h-px w-12 bg-border" />
                </div>
              </div>
              
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  AI Processing...
                </div>
              </div>
            </div>
          </div>

          {/* Output Side */}
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-foreground">Output</span>
            </div>
            <div className="p-6 space-y-4">
              {/* Instagram Preview */}
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Instagram Post</div>
                    <div className="text-xs text-muted-foreground">Ready to post</div>
                  </div>
                </div>
                
                <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-2">5 Habits</div>
                    <div className="text-sm text-muted-foreground">That Changed My Life</div>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                  <ListChecks className="h-4 w-4" />
                  Caption
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  Transform your mornings with these 5 habits that successful people swear by. Start with just one and watch your productivity soar.
                </p>
              </div>

              {/* Hashtags */}
              <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Hashtags
                </div>
                <div className="flex flex-wrap gap-2">
                  {['productivity', 'habits', 'success', 'motivation', 'growth'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
