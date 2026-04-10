"use client"

import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const platforms = [
  { id: "twitter", icon: Twitter, label: "X" },
  { id: "instagram", icon: Instagram, label: "Instagram" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { id: "facebook", icon: Facebook, label: "Facebook" },
]

const tones = [
  "Funny",
  "Informational", 
  "Sarcastic",
  "Relatable",
  "Educational",
  "Motivational"
]

const niches = [
  "Tech",
  "Finance",
  "Fitness",
  "Business",
  "Education",
  "Entertainment"
]

interface SettingsPanelProps {
  selectedPlatforms: string[]
  onPlatformsChange: (platforms: string[]) => void
  wordLimit: number
  onWordLimitChange: (limit: number) => void
  tone: string
  onToneChange: (tone: string) => void
  niche: string
  onNicheChange: (niche: string) => void
}

export function SettingsPanel({
  selectedPlatforms,
  onPlatformsChange,
  wordLimit,
  onWordLimitChange,
  tone,
  onToneChange,
  niche,
  onNicheChange
}: SettingsPanelProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Customize your content output</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Platform Selection */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Platforms
          </Label>
          <ToggleGroup 
            type="multiple" 
            value={selectedPlatforms}
            onValueChange={onPlatformsChange}
            className="grid grid-cols-4 gap-2"
          >
            {platforms.map((platform) => (
              <ToggleGroupItem
                key={platform.id}
                value={platform.id}
                className="flex flex-col items-center gap-1 p-3 h-auto data-[state=on]:bg-primary/20 data-[state=on]:border-primary/50 border border-border/50 rounded-xl"
              >
                <platform.icon className="h-5 w-5" />
                <span className="text-xs">{platform.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Word Limit */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-foreground">
              Word Limit
            </Label>
            <span className="text-sm text-muted-foreground">{wordLimit} words</span>
          </div>
          <Slider
            value={[wordLimit]}
            onValueChange={(value) => onWordLimitChange(value[0])}
            min={50}
            max={500}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>50</span>
            <span>500</span>
          </div>
        </div>

        {/* Tone */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Tone
          </Label>
          <Select value={tone} onValueChange={onToneChange}>
            <SelectTrigger className="w-full bg-secondary/30 border-border/50">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((t) => (
                <SelectItem key={t} value={t.toLowerCase()}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Niche */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Niche
          </Label>
          <Select value={niche} onValueChange={onNicheChange}>
            <SelectTrigger className="w-full bg-secondary/30 border-border/50">
              <SelectValue placeholder="Select niche" />
            </SelectTrigger>
            <SelectContent>
              {niches.map((n) => (
                <SelectItem key={n} value={n.toLowerCase()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
