"use client"

import { Image, Type, ImagePlus, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const imageStyles = [
  { id: "visual-only", icon: Image, label: "Visual Only" },
  { id: "visual-text", icon: ImagePlus, label: "Visual + Text" },
  { id: "visual-title", icon: Type, label: "Visual + Title" },
  { id: "text-only", icon: FileText, label: "Text Only" },
]

interface ImageSettingsProps {
  imageStyle: string
  onImageStyleChange: (style: string) => void
  useTextAsReference: boolean
  onUseTextAsReferenceChange: (enabled: boolean) => void
}

export function ImageSettings({
  imageStyle,
  onImageStyleChange,
  useTextAsReference,
  onUseTextAsReferenceChange
}: ImageSettingsProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Image Settings</h2>
        <p className="text-sm text-muted-foreground">Configure visual output style</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Image Style */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Image Style
          </Label>
          <ToggleGroup 
            type="single" 
            value={imageStyle}
            onValueChange={(value) => value && onImageStyleChange(value)}
            className="grid grid-cols-2 gap-2"
          >
            {imageStyles.map((style) => (
              <ToggleGroupItem
                key={style.id}
                value={style.id}
                className="flex flex-col items-center gap-2 p-4 h-auto data-[state=on]:bg-primary/20 data-[state=on]:border-primary/50 border border-border/50 rounded-xl"
              >
                <style.icon className="h-5 w-5" />
                <span className="text-xs text-center">{style.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Use Text as Reference */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="text-reference" className="text-sm font-medium text-foreground cursor-pointer">
                Use generated text as image reference
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Creates visuals that match your content
              </p>
            </div>
            <Switch
              id="text-reference"
              checked={useTextAsReference}
              onCheckedChange={onUseTextAsReferenceChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
