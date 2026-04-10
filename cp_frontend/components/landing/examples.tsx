"use client"

import { Instagram, Linkedin, ArrowRight, Dumbbell, TrendingUp } from "lucide-react"

const examples = [
  {
    id: 1,
    topic: "Fitness tips for beginners",
    icon: Dumbbell,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    platform: "Instagram",
    platformIcon: Instagram,
    platformGradient: "from-purple-500 via-pink-500 to-orange-500",
    output: {
      title: "Start Your Fitness Journey",
      caption: "Ready to transform your body? Here are 5 beginner-friendly tips that actually work. No gym required.",
      hashtags: ["fitness", "workout", "health", "motivation"]
    }
  },
  {
    id: 2,
    topic: "Marketing strategy blog post",
    icon: TrendingUp,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    platform: "LinkedIn",
    platformIcon: Linkedin,
    platformGradient: "from-blue-600 to-blue-700",
    output: {
      title: "The Future of Marketing",
      caption: "After analyzing 500+ campaigns, here&apos;s what the top 1% of marketers do differently. Thread on growth strategies.",
      hashtags: ["marketing", "growth", "strategy", "business"]
    }
  }
]

export function Examples() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Real Examples
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how different topics transform into engaging social media content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {examples.map((example) => (
            <div 
              key={example.id}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Input */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${example.iconBg} flex items-center justify-center`}>
                    <example.icon className={`h-6 w-6 ${example.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Topic</div>
                    <div className="font-medium text-foreground">{example.topic}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${example.platformGradient} flex items-center justify-center`}>
                    <example.platformIcon className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Output Preview */}
                <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-4">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-orange-500/10 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="text-xl font-bold text-foreground mb-1">{example.output.title}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {example.output.caption}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {example.output.hashtags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
