"use client"

import { 
  Globe, 
  Sparkles, 
  Image, 
  Search, 
  Sliders, 
  Edit3, 
  Zap 
} from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Multi-Platform Content",
    description: "Generate optimized content for Instagram, X, LinkedIn, and Facebook simultaneously.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Captions",
    description: "Powered by Gemini AI to create engaging hooks and captions that convert.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Image,
    title: "Smart Image Generation",
    description: "Generate stunning visuals with Replicate that match your content perfectly.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Search,
    title: "Real-Time Web Search",
    description: "Pull in the latest information and trends to keep your content relevant.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Sliders,
    title: "Custom Tone & Niche",
    description: "Choose your tone — funny, professional, educational — and your specific niche.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Edit3,
    title: "Editable Outputs",
    description: "Fine-tune every aspect of your generated content before posting.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get complete posts with visuals in under 5 seconds. No waiting around.",
    gradient: "from-pink-500 to-rose-500"
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make content creation effortless and fast
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card ${
                index === 6 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
