"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "ContentPilot saved me hours every single day. I used to spend 3+ hours creating content, now it takes minutes.",
    author: "Sarah Chen",
    role: "Content Creator",
    avatar: "SC",
    rating: 5
  },
  {
    id: 2,
    quote: "Best content tool I&apos;ve ever used. The AI understands my brand voice perfectly and the visuals are stunning.",
    author: "Marcus Johnson",
    role: "Marketing Director",
    avatar: "MJ",
    rating: 5
  },
  {
    id: 3,
    quote: "Finally, a tool that actually delivers. My engagement has increased 340% since I started using ContentPilot.",
    author: "Emily Rodriguez",
    role: "Social Media Manager",
    avatar: "ER",
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Loved by Creators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who trust ContentPilot for their social media content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/50"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <blockquote className="text-foreground mb-6 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
