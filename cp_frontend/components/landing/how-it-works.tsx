"use client"

import { Link2, Brain, Download, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste a link or topic",
    description: "Drop a YouTube video, blog URL, or simply describe your content idea."
  },
  {
    icon: Brain,
    step: "02",
    title: "AI analyzes and generates",
    description: "Our AI extracts key insights and creates optimized content for each platform."
  },
  {
    icon: Download,
    step: "03",
    title: "Download and post",
    description: "Get your ready-to-use captions, visuals, and hashtags instantly."
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform any content into engaging social media posts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative group">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 h-full transition-all duration-300 hover:border-primary/50 hover:bg-card">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20 flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-5xl font-bold text-border/50 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-border/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
