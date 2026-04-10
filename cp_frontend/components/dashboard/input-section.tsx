"use client"

import { useState } from "react"
import { Link2, FileText, Globe } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export type InputType = "url" | "youtube" | "text"

interface InputSectionProps {
  value: string
  onChange: (value: string) => void
  onInputTypeChange: (type: InputType) => void
  webSearchEnabled: boolean
  onWebSearchToggle: (enabled: boolean) => void
}

function detectInputType(value: string, activeTab: string): InputType {
  if (activeTab === "topic") return "text"
  if (/youtube\.com|youtu\.be/i.test(value)) return "youtube"
  return "url"
}

export function InputSection({
  value,
  onChange,
  onInputTypeChange,
  webSearchEnabled,
  onWebSearchToggle,
}: InputSectionProps) {
  const [activeTab, setActiveTab] = useState("link")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onInputTypeChange(detectInputType(value, tab))
  }

  const handleValueChange = (newValue: string) => {
    onChange(newValue)
    onInputTypeChange(detectInputType(newValue, activeTab))
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Content Input</h2>
        <p className="text-sm text-muted-foreground">Paste a link or describe your content idea</p>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
            <TabsTrigger value="link" className="flex items-center gap-2 data-[state=active]:bg-card">
              <Link2 className="h-4 w-4" />
              Paste Link
            </TabsTrigger>
            <TabsTrigger value="topic" className="flex items-center gap-2 data-[state=active]:bg-card">
              <FileText className="h-4 w-4" />
              Manual Topic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-0">
            <Textarea
              placeholder="Paste a YouTube video, blog post, or article URL..."
              className="min-h-[120px] resize-none bg-secondary/30 border-border/50 focus:border-primary"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Supports YouTube, blogs, articles, and GitHub READMEs
            </p>
          </TabsContent>

          <TabsContent value="topic" className="mt-0">
            <Textarea
              placeholder="Describe your content idea or topic in detail..."
              className="min-h-[120px] resize-none bg-secondary/30 border-border/50 focus:border-primary"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Be specific about your topic, audience, and desired tone
            </p>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="web-search" className="text-sm font-medium text-foreground cursor-pointer">
                  Real-time Web Search
                </Label>
                <p className="text-xs text-muted-foreground">Pull in latest information and trends</p>
              </div>
            </div>
            <Switch
              id="web-search"
              checked={webSearchEnabled}
              onCheckedChange={onWebSearchToggle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
