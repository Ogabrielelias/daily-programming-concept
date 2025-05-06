import { GameContainer } from "@/components/game-container"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-2">
          Programming Concept Guesser
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-center mb-8">
          Guess the daily programming language, framework, or concept based on the hints!
        </p>
        <GameContainer />
      </div>
    </main>
  )
}
