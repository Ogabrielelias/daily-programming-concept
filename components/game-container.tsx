"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Calendar } from "lucide-react"
import { programmingConcepts } from "@/data/programming-concepts"
import { GuessInput } from "@/components/guess-input"
import { GuessList } from "@/components/guess-list"
import { SuccessCelebration } from "@/components/success-celebration"
import { usePostHog } from "posthog-js/react"
import { formatList, toTitleCase } from "@/lib/utils"

export type Concept = {
  name: string;
  category: string;
  level: string;
  paradigm: string;
  yearCreated: number;
  description: string;
  creator: string;
  useCases: string[];
  relatedTech: string[];
  popularity: string;
  learningCurve: string;
  keyFeatures: string[];
}

export type Guess = {
  name: string
  correct: boolean
  category: string
  level: string
  paradigm: string
  yearCreated: number
}

export type GameSettings = {
  categories: string[]
  difficulty: "easy" | "medium" | "hard"
  maxGuesses: number
}

// Function to get a deterministic concept based on the current date
function getDailyProgrammingConcept(): Concept {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  // Create a simple hash from the date string
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }

  // Use the absolute value of the hash to get an index
  const index = Math.abs(hash) % programmingConcepts.length
  return programmingConcepts[index]
}

// Function to format the current date
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Function to get a date key in YYYY-MM-DD format for comparison
function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function GameContainer() {
  const [currentConcept, setCurrentConcept] = useState<Concept | null>(null)
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [currentDate, setCurrentDate] = useState<string>("")

  const posthog = usePostHog()

  // Use a ref to track the current date key for comparison
  const currentDateKeyRef = useRef<string>(getDateKey(new Date()))

  const [settings, setSettings] = useState<GameSettings>({
    categories: ["language", "framework", "concept"],
    difficulty: "medium",
    maxGuesses: 10,
  })

  useEffect(() => {
    // Initialize the game
    startNewGame()

    // Set the current formatted date for display
    const today = new Date()
    setCurrentDate(formatDate(today))
    currentDateKeyRef.current = getDateKey(today)

    // Check for date change every minute
    const interval = setInterval(() => {
      const now = new Date()
      const newDateKey = getDateKey(now)

      // Only reset if the actual date has changed (not just the time)
      if (newDateKey !== currentDateKeyRef.current) {
        currentDateKeyRef.current = newDateKey
        setCurrentDate(formatDate(now))
        startNewGame() // Reset the game when the date changes
      } else {
        // Just update the formatted date display if needed
        setCurrentDate(formatDate(now))
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const startNewGame = () => {
    // Get the daily concept instead of a random one
    const concept = getDailyProgrammingConcept()
    setCurrentConcept(concept)
    setGuesses([])
    setShowSuccess(false)
    setHintsRevealed(0)

    // Generate hints
    const generatedHints = [
      `${toTitleCase(concept.popularity)} popularity and has a ${concept.learningCurve} learning curve`,
      `It's related to ${formatList(concept.relatedTech)}`,
      `Commonly used for ${formatList(concept.useCases)}`,
      `It's keys features are ${formatList(concept.keyFeatures)}`,
      `Created by ${concept.creator}`,
      concept.description,
      `Word Skeleton: ${concept.name.split("").map((char, i) => {
        if (i == 0) {
          return char.toUpperCase()
        }

        if (char == " ") {
          return "\xa0"
        }

        return "_"

      }).join(" ")} `
    ]

    setHints(generatedHints)
  }

  const handleGuess = (guess: string) => {
    if (!currentConcept) return

    // Find the guessed concept from the database
    const guessedConcept = programmingConcepts.find((concept) => concept.name.toLowerCase() === guess.toLowerCase())

    if (!guessedConcept) return

    const isCorrect = guess.toLowerCase() === currentConcept.name.toLowerCase()

    const newGuess: Guess = {
      name: guess,
      correct: isCorrect,
      category: guessedConcept.category,
      level: guessedConcept.level,
      paradigm: guessedConcept.paradigm,
      yearCreated: guessedConcept.yearCreated,
    }

    setGuesses([newGuess, ...guesses])

    if (isCorrect) {
      posthog.capture('$correctAnswer', { "$guessesQty": guesses.length, "$guessesList": guesses.map(guess => guess.name), "$hintsQty": hintsRevealed })
      setShowSuccess(true)
    }
  }

  const revealHint = () => {
    if (hintsRevealed < hints.length) {
      setHintsRevealed(hintsRevealed + 1)
    }
  }

  return (
    <div className="space-y-6">
      {showSuccess && currentConcept ? (
        <SuccessCelebration concept={currentConcept} onNewGame={startNewGame} />
      ) : (
        <Card className="bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4 w-full flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Concept</h2>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4 mr-1" />
                {currentDate}
              </div>
            </div>

            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              A new programming concept is selected each day. Come back tomorrow for a new challenge!
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Hints</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={revealHint}
                    disabled={hintsRevealed >= hints.length || showSuccess}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-slate-700"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" /> Reveal Hint
                  </Button>
                </div>
                <div className="space-y-2">
                  {hints.slice(0, hintsRevealed).map((hint, index) => (
                    <div
                      key={index}
                      className="bg-white/10 border border-slate-200 dark:bg-slate-700/10 dark:border-slate-600 p-3 rounded-md text-slate-700 dark:text-slate-200"
                    >
                      {hint}
                    </div>
                  ))}
                  {hintsRevealed === 0 && (
                    <div className="bg-white/10 border border-slate-200 dark:bg-slate-700/10 dark:border-slate-600 p-3 rounded-md text-slate-500 dark:text-slate-400 italic">
                      Click "Reveal Hint" to get your first clue!
                    </div>
                  )}
                </div>
              </div>

              <GuessInput onGuess={handleGuess} disabled={showSuccess} />
            </div>
          </CardContent>
        </Card>
      )}

      <GuessList guesses={guesses} currentConcept={currentConcept} />
    </div>
  )
}
