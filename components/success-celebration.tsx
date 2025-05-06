"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Concept } from "./game-container"
import { PartyPopper, Trophy } from "lucide-react"
import confetti from "canvas-confetti"

interface SuccessCelebrationProps {
  concept: Concept
  onNewGame: () => void
}

export function SuccessCelebration({ concept, onNewGame }: SuccessCelebrationProps) {
  useEffect(() => {
    // Trigger confetti when component mounts
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/50 to-transparent dark:from-emerald-600/20 dark:to-transparent"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-600/30 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-emerald-800 dark:text-white mb-2">Congratulations!</h2>
            <p className="text-emerald-700 dark:text-emerald-300 text-lg">
              You correctly guessed <span className="font-bold">{concept.name}</span>!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-4">
            <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Category</p>
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{concept.category}</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Level</p>
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{concept.level}</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Paradigm</p>
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{concept.paradigm}</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Year Created</p>
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{concept.yearCreated}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800/50 w-full max-w-md">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Description</p>
            <p className="text-slate-700 dark:text-slate-200">{concept.description}</p>
          </div>

          <Button
            onClick={onNewGame}
            className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800 mt-4"
            size="lg"
          >
            <PartyPopper className="mr-2 h-5 w-5" /> Play Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
