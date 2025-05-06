import type { Guess } from "./game-container"
import type { Concept } from "./game-container"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface GuessListProps {
  guesses: Guess[]
  currentConcept: Concept | null
}

export function GuessList({ guesses, currentConcept }: GuessListProps) {
  // Function to check if a property matches
  const isMatch = (guessProperty: string | number, conceptProperty: string | number) => {
    if (typeof guessProperty === "string" && typeof conceptProperty === "string") {
      return guessProperty.toLowerCase() === conceptProperty.toLowerCase()
    }
    return guessProperty === conceptProperty
  }

  return (
    <div className="space-y-3">
      {guesses.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-4">No guesses yet. Start guessing!</p>
      ) : (
        guesses.map((guess, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center gap-3 ${
              guess.correct
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700"
                : "bg-white border-slate-200 dark:bg-slate-700 dark:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              {guess.correct ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
              )}
              <span className="font-medium text-slate-800 dark:text-white">{guess.name}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`${
                  currentConcept && isMatch(guess.category, currentConcept.category)
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                    : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                }`}
              >
                {currentConcept && isMatch(guess.category, currentConcept.category) && (
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                )}
                {guess.category}
              </Badge>

              <Badge
                variant="outline"
                className={`${
                  currentConcept && isMatch(guess.level, currentConcept.level)
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                    : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                }`}
              >
                {currentConcept && isMatch(guess.level, currentConcept.level) && (
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                )}
                {guess.level}-level
              </Badge>

              <Badge
                variant="outline"
                className={`${
                  currentConcept && isMatch(guess.paradigm, currentConcept.paradigm)
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                    : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                }`}
              >
                {currentConcept && isMatch(guess.paradigm, currentConcept.paradigm) && (
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                )}
                {guess.paradigm}
              </Badge>

              <Badge
                variant="outline"
                className={`${
                  currentConcept && isMatch(guess.yearCreated, currentConcept.yearCreated)
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                    : currentConcept && Math.abs(guess.yearCreated - currentConcept.yearCreated) <= 5
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700"
                      : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                }`}
              >
                {currentConcept && isMatch(guess.yearCreated, currentConcept.yearCreated) ? (
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                ) : currentConcept && Math.abs(guess.yearCreated - currentConcept.yearCreated) <= 5 ? (
                  <AlertCircle className="h-3 w-3 mr-1 text-yellow-600 dark:text-yellow-400" />
                ) : null}
                {guess.yearCreated}
              </Badge>
            </div>
          </div>
        ))
      )}

      {guesses.length > 0 && currentConcept && !guesses.some((g) => g.correct) && (
        <div className="mt-4 p-3 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 text-sm">
          <p className="font-medium mb-1">Property Matching Guide:</p>
          <ul className="space-y-1 text-xs">
            <li className="flex items-center">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 mr-2"
              >
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                Example
              </Badge>
              <span>Exact match - this property is correct!</span>
            </li>
            <li className="flex items-center">
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700 mr-2"
              >
                <AlertCircle className="h-3 w-3 mr-1 text-yellow-600 dark:text-yellow-400" />
                Example
              </Badge>
              <span>Close match - for year, within 5 years</span>
            </li>
            <li className="flex items-center">
              <Badge
                variant="outline"
                className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 mr-2"
              >
                Example
              </Badge>
              <span>No match - this property doesn't match</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
