"use client"

import { useState } from "react"
import { Wand2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const suggestions = [
  "Make it funnier",
  "Shorten this",
  "Add more details",
  "Make it professional",
  "Add urgency"
]

interface AIEditProps {
  onEdit: (instruction: string) => void
  isProcessing: boolean
}

export function AIEdit({ onEdit, isProcessing }: AIEditProps) {
  const [instruction, setInstruction] = useState("")

  const handleSubmit = () => {
    if (instruction.trim()) {
      onEdit(instruction)
      setInstruction("")
    }
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Edit</h2>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your edit instruction..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="bg-secondary/30 border-border/50"
          />
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing || !instruction.trim()}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onEdit(suggestion)}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-full bg-secondary/50 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
