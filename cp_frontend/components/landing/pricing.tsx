"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ContentPilot",
    features: [
      "5 generations per day",
      "2 platforms (Instagram, X)",
      "Basic image styles",
      "Standard support"
    ],
    cta: "Get Started",
    featured: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious content creators",
    features: [
      "Unlimited generations",
      "All platforms supported",
      "All image styles & templates",
      "Custom tone & branding",
      "Priority speed",
      "Priority support",
      "API access"
    ],
    cta: "Start Pro Trial",
    featured: true
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your content creation needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-2xl border p-8 transition-all duration-300 ${
                plan.featured 
                  ? 'border-primary bg-card relative overflow-hidden' 
                  : 'border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white text-xs font-medium px-4 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/{plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.featured ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Check className={`h-3 w-3 ${plan.featured ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/dashboard" className="block">
                <Button 
                  className={`w-full ${
                    plan.featured 
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white hover:opacity-90' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
