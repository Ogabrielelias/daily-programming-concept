"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { GameSettings } from "./game-container"

interface GameOptionsProps {
  settings: GameSettings
  updateSettings: (settings: Partial<GameSettings>) => void
}

export function GameOptions({ settings, updateSettings }: GameOptionsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings })

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories = [...localSettings.categories]

    if (checked) {
      newCategories.push(category)
    } else {
      newCategories = newCategories.filter((c) => c !== category)
    }

    // Ensure at least one category is selected
    if (newCategories.length === 0) {
      return
    }

    const newSettings = { ...localSettings, categories: newCategories }
    setLocalSettings(newSettings)
    updateSettings(newSettings)
  }

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    const newSettings = { ...localSettings, difficulty }
    setLocalSettings(newSettings)
    updateSettings(newSettings)
  }

  const handleMaxGuessesChange = (value: number[]) => {
    const newSettings = { ...localSettings, maxGuesses: value[0] }
    setLocalSettings(newSettings)
    updateSettings(newSettings)
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="language"
              checked={localSettings.categories.includes("language")}
              onCheckedChange={(checked) => handleCategoryChange("language", checked as boolean)}
              disabled={localSettings.categories.length === 1 && localSettings.categories.includes("language")}
            />
            <Label htmlFor="language" className="text-slate-300">
              Programming Languages
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="framework"
              checked={localSettings.categories.includes("framework")}
              onCheckedChange={(checked) => handleCategoryChange("framework", checked as boolean)}
              disabled={localSettings.categories.length === 1 && localSettings.categories.includes("framework")}
            />
            <Label htmlFor="framework" className="text-slate-300">
              Frameworks & Libraries
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="concept"
              checked={localSettings.categories.includes("concept")}
              onCheckedChange={(checked) => handleCategoryChange("concept", checked as boolean)}
              disabled={localSettings.categories.length === 1 && localSettings.categories.includes("concept")}
            />
            <Label htmlFor="concept" className="text-slate-300">
              Concepts & Tools
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Difficulty</h3>
        <RadioGroup
          value={localSettings.difficulty}
          onValueChange={(value) => handleDifficultyChange(value as "easy" | "medium" | "hard")}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="easy" id="easy" />
            <Label htmlFor="easy" className="text-slate-300">
              Easy (more hints, including first letter)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-slate-300">
              Medium (standard hints)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="text-slate-300">
              Hard (fewer hints)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-white">Max Guesses</h3>
          <span className="text-slate-300 font-medium">{localSettings.maxGuesses}</span>
        </div>
        <Slider
          defaultValue={[localSettings.maxGuesses]}
          max={15}
          min={5}
          step={1}
          onValueChange={handleMaxGuessesChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>5</span>
          <span>10</span>
          <span>15</span>
        </div>
      </div>
    </div>
  )
}
