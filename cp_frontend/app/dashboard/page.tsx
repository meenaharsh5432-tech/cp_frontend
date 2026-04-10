"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { InputSection, InputType } from "@/components/dashboard/input-section"
import { SettingsPanel } from "@/components/dashboard/settings-panel"
import { GenerateButton } from "@/components/dashboard/generate-button"
import { LoadingState } from "@/components/dashboard/loading-state"
import { OutputSection, GeneratedContent } from "@/components/dashboard/output-section"
import { AIEdit } from "@/components/dashboard/ai-edit"
import { HistoryPanel } from "@/components/dashboard/history-panel"
import { useAuth } from "@/hooks/useAuth"
import { api, JobListItem } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Input state
  const [inputValue, setInputValue] = useState("")
  const [inputType, setInputType] = useState<InputType>("url")
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)

  // Settings state
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"])
  const [wordLimit, setWordLimit] = useState(150)
  const [tone, setTone] = useState("informational")
  const [niche, setNiche] = useState("business")

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingSteps, setLoadingSteps] = useState([
    { id: "extract", label: "Extracting content…", completed: false, active: false },
    { id: "text", label: "Generating content (GPT-4o)…", completed: false, active: false },
    { id: "finalize", label: "Finalizing outputs…", completed: false, active: false },
  ])

  // History state
  const [history, setHistory] = useState<JobListItem[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
    }
  }, [authLoading, user, router])

  // Load history
  useEffect(() => {
    if (!user) return
    api.jobs.list().then(setHistory).catch(() => {})
  }, [user])

  const resetSteps = () =>
    setLoadingSteps((prev) => prev.map((s) => ({ ...s, completed: false, active: false })))

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim()) return
    setError(null)
    setIsGenerating(true)
    setGeneratedContent(null)
    resetSteps()

    // Animate step 1
    setLoadingSteps((prev) => prev.map((s) => (s.id === "extract" ? { ...s, active: true } : s)))

    try {
      // Start the real API call — it handles all steps server-side
      const jobPromise = api.jobs.create({ inputType, input: inputValue.trim() })

      // Animate step 2 after a short delay for UX
      await new Promise((r) => setTimeout(r, 1500))
      setLoadingSteps((prev) =>
        prev.map((s) =>
          s.id === "extract"
            ? { ...s, completed: true, active: false }
            : s.id === "text"
            ? { ...s, active: true }
            : s
        )
      )

      const job = await jobPromise

      // Animate step 3
      setLoadingSteps((prev) =>
        prev.map((s) =>
          s.id === "text"
            ? { ...s, completed: true, active: false }
            : s.id === "finalize"
            ? { ...s, active: true }
            : s
        )
      )
      await new Promise((r) => setTimeout(r, 400))
      setLoadingSteps((prev) =>
        prev.map((s) => (s.id === "finalize" ? { ...s, completed: true, active: false } : s))
      )

      setGeneratedContent({
        shortHook: job.shortHook || "",
        twitterThread: job.twitterThread || "",
        linkedinPost: job.linkedinPost || "",
        newsletter: job.newsletter || "",
      })

      // Prepend to history
      setHistory((prev) => [
        {
          id: job.id,
          status: job.status,
          inputType: job.inputType,
          inputUrl: job.inputUrl,
          shortHook: job.shortHook,
          voiceProfile: job.voiceProfile,
          createdAt: job.createdAt,
        },
        ...prev,
      ])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsGenerating(false)
      setTimeout(resetSteps, 500)
    }
  }, [inputValue, inputType])

  const handleHistorySelect = useCallback(async (item: JobListItem) => {
    try {
      const job = await api.jobs.get(item.id)
      setGeneratedContent({
        shortHook: job.shortHook || "",
        twitterThread: job.twitterThread || "",
        linkedinPost: job.linkedinPost || "",
        newsletter: job.newsletter || "",
      })
    } catch {
      // ignore
    }
  }, [])

  const handleDeleted = useCallback((id: string) => {
    setHistory((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const handleAIEdit = (instruction: string) => {
    console.log("AI Edit instruction:", instruction)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <InputSection
              value={inputValue}
              onChange={setInputValue}
              onInputTypeChange={setInputType}
              webSearchEnabled={webSearchEnabled}
              onWebSearchToggle={setWebSearchEnabled}
            />

            <SettingsPanel
              selectedPlatforms={selectedPlatforms}
              onPlatformsChange={setSelectedPlatforms}
              wordLimit={wordLimit}
              onWordLimitChange={setWordLimit}
              tone={tone}
              onToneChange={setTone}
              niche={niche}
              onNicheChange={setNiche}
            />

            <GenerateButton
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!inputValue.trim() || isGenerating}
            />

            {error && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {isGenerating ? (
              <LoadingState steps={loadingSteps} />
            ) : generatedContent ? (
              <>
                <OutputSection
                  content={generatedContent}
                  onContentChange={setGeneratedContent}
                />
                <AIEdit onEdit={handleAIEdit} isProcessing={false} />
              </>
            ) : (
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Create</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a link or topic on the left and click Generate to create your content.
                </p>
              </div>
            )}

            <HistoryPanel
              items={history}
              onSelect={handleHistorySelect}
              onDeleted={handleDeleted}
            />
          </div>
        </div>
      </main>

      {/* Mobile sticky generate button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <GenerateButton
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={!inputValue.trim() || isGenerating}
        />
      </div>
    </div>
  )
}
