"use client"

import { Check, Loader2 } from "lucide-react"

interface LoadingStep {
  id: string
  label: string
  completed: boolean
  active: boolean
}

interface LoadingStateProps {
  steps: LoadingStep[]
}

export function LoadingState({ steps }: LoadingStateProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Generating Content</h2>
        <p className="text-sm text-muted-foreground">Please wait while AI creates your content</p>
      </div>
      
      <div className="p-6">
        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.completed 
                  ? 'bg-green-500/20 text-green-500' 
                  : step.active 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary text-muted-foreground'
              }`}>
                {step.completed ? (
                  <Check className="h-4 w-4" />
                ) : step.active ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${
                step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Skeleton Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Skeleton */}
          <div className="aspect-square rounded-xl bg-secondary/50 shimmer" />
          
          {/* Text Skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-secondary/50 rounded shimmer w-3/4" />
            <div className="h-4 bg-secondary/50 rounded shimmer w-full" />
            <div className="h-4 bg-secondary/50 rounded shimmer w-5/6" />
            <div className="h-4 bg-secondary/50 rounded shimmer w-2/3" />
            <div className="mt-6 space-y-3">
              <div className="h-3 bg-secondary/50 rounded shimmer w-full" />
              <div className="h-3 bg-secondary/50 rounded shimmer w-4/5" />
              <div className="h-3 bg-secondary/50 rounded shimmer w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
