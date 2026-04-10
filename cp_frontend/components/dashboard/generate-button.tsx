"use client"

import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface GenerateButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
}

export function GenerateButton({ onClick, isLoading, disabled }: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white hover:opacity-90 transition-all duration-300 glow-purple disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-5 w-5" />
          Generating...
        </>
      ) : (
        <>
          Generate Content
          <Zap className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  )
}
