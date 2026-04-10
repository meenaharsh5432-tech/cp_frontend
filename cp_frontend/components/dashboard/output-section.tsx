"use client"

import { useState } from "react"
import { Copy, Check, Twitter, Linkedin, Mail, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface GeneratedContent {
  shortHook: string
  twitterThread: string
  linkedinPost: string
  newsletter: string
}

interface OutputSectionProps {
  content: GeneratedContent
  onContentChange: (content: GeneratedContent) => void
}

export function OutputSection({ content, onContentChange }: OutputSectionProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const CopyButton = ({ field, text }: { field: string; text: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-muted-foreground hover:text-foreground"
      onClick={() => handleCopy(text, field)}
    >
      {copied === field ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  )

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Generated Content</h2>
        <p className="text-sm text-muted-foreground">Edit and copy your output</p>
      </div>

      <div className="p-6">
        <Tabs defaultValue="hook">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary/50">
            <TabsTrigger value="hook" className="flex items-center gap-1.5 data-[state=active]:bg-card text-xs">
              <Zap className="h-3.5 w-3.5" />
              Hook
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-1.5 data-[state=active]:bg-card text-xs">
              <Twitter className="h-3.5 w-3.5" />
              Thread
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1.5 data-[state=active]:bg-card text-xs">
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-1.5 data-[state=active]:bg-card text-xs">
              <Mail className="h-3.5 w-3.5" />
              Newsletter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hook" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Short scroll-stopping hook sentence</p>
              <CopyButton field="hook" text={content.shortHook} />
            </div>
            <Textarea
              value={content.shortHook}
              onChange={(e) => onContentChange({ ...content, shortHook: e.target.value })}
              className="min-h-[80px] resize-none bg-secondary/30 border-border/50"
              placeholder="Your hook will appear here..."
            />
          </TabsContent>

          <TabsContent value="twitter" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Twitter/X thread (numbered tweets)</p>
              <CopyButton field="twitter" text={content.twitterThread} />
            </div>
            <Textarea
              value={content.twitterThread}
              onChange={(e) => onContentChange({ ...content, twitterThread: e.target.value })}
              className="min-h-[300px] resize-none bg-secondary/30 border-border/50 font-mono text-sm"
              placeholder="Your Twitter thread will appear here..."
            />
          </TabsContent>

          <TabsContent value="linkedin" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">LinkedIn post (professional tone)</p>
              <CopyButton field="linkedin" text={content.linkedinPost} />
            </div>
            <Textarea
              value={content.linkedinPost}
              onChange={(e) => onContentChange({ ...content, linkedinPost: e.target.value })}
              className="min-h-[200px] resize-none bg-secondary/30 border-border/50"
              placeholder="Your LinkedIn post will appear here..."
            />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-0 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Newsletter snippet (inbox-friendly)</p>
              <CopyButton field="newsletter" text={content.newsletter} />
            </div>
            <Textarea
              value={content.newsletter}
              onChange={(e) => onContentChange({ ...content, newsletter: e.target.value })}
              className="min-h-[150px] resize-none bg-secondary/30 border-border/50"
              placeholder="Your newsletter snippet will appear here..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
