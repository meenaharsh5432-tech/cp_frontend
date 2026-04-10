"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setToken } from "@/lib/api"
import { Suspense } from "react"

function CallbackHandler() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get("token")
    const onboarding = params.get("onboarding")

    if (!token) {
      router.replace("/login?error=no_token")
      return
    }

    setToken(token)

    if (onboarding === "true") {
      router.replace("/dashboard?onboarding=true")
    } else {
      router.replace("/dashboard")
    }
  }, [params, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 mx-auto">
          <span className="text-lg font-bold text-white">CP</span>
        </div>
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
