"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, Zap, Clock } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-muted-foreground">AI-Powered Content Generation</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            <span className="text-foreground">Turn Any Content into </span>
            <span className="gradient-text">Ready-to-Post Social Media</span>
            <span className="text-foreground"> in Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Paste a YouTube video, blog, or idea — get captions, posts, and designs instantly with AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white hover:opacity-90 transition-opacity px-8 h-12 text-base glow-purple">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 text-base border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card">
              <Play className="mr-2 h-5 w-5" />
              See Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                <Zap className="h-5 w-5 text-orange-400" />
                {"<5s"}
              </div>
              <p className="text-sm text-muted-foreground">Generation Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <p className="text-sm text-muted-foreground">Creators</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                <Clock className="h-5 w-5 text-blue-400" />
                20h
              </div>
              <p className="text-sm text-muted-foreground">Saved Weekly</p>
            </div>
          </div>

          {/* Product Mockup */}
          <div className="relative mx-auto max-w-5xl">
            <div className="gradient-border rounded-2xl overflow-hidden bg-card">
              <div className="p-1">
                <div className="rounded-xl bg-card overflow-hidden">
                  {/* Mockup header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                        contentpilot.app/dashboard
                      </div>
                    </div>
                  </div>
                  
                  {/* Mockup content */}
                  <div className="p-6 grid md:grid-cols-2 gap-6">
                    {/* Input side */}
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-muted-foreground">INPUT</div>
                      <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Play className="h-5 w-5 text-red-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">YouTube Video</div>
                            <div className="text-xs text-muted-foreground">Productivity habits that changed my life</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground bg-background/50 rounded-lg p-3 font-mono">
                          youtube.com/watch?v=abc123
                        </div>
                      </div>
                    </div>

                    {/* Output side */}
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-muted-foreground">OUTPUT</div>
                      <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">IG</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">Instagram Post</span>
                        </div>
                        <div className="aspect-square w-full max-w-[200px] mx-auto rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20 flex items-center justify-center">
                          <div className="text-center">
                            <Sparkles className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                            <span className="text-xs text-muted-foreground">Generated Visual</span>
                          </div>
                        </div>
                        <div className="text-xs text-foreground leading-relaxed">
                          Transform your mornings with these 5 habits that successful people swear by...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
