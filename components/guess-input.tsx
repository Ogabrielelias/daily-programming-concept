"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { programmingConcepts } from "@/data/programming-concepts"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface GuessInputProps {
  onGuess: (guess: string) => void
  disabled?: boolean
}

export function GuessInput({ onGuess, disabled = false }: GuessInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedValue) {
      onGuess(selectedValue)
      setInputValue("")
      setSelectedValue("")
      setOpen(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="py-3 h-fit w-full justify-between bg-white border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
          >
            {selectedValue
              ? programmingConcepts.find((concept) => concept.name.toLowerCase() === selectedValue.toLowerCase())?.name
              : "Select a programming concept..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search programming concepts..."
              className="text-slate-700 dark:text-white"
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="text-slate-500 dark:text-slate-400">No concept found.</CommandEmpty>
              <CommandGroup>
                {programmingConcepts
                  .filter((concept) => concept.name.toLowerCase().includes(inputValue.toLowerCase()))
                  // Removed the .slice(0, 10) limitation here
                  .map((concept) => (
                    <CommandItem
                      key={concept.name}
                      value={concept.name}
                      onSelect={(currentValue) => {
                        setSelectedValue(currentValue)
                        setOpen(false)
                      }}
                      className={`text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700 ${selectedValue === concept.name.toLowerCase() ? "bg-slate-100 dark:bg-slate-700" : ""
                        }`}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === concept.name.toLowerCase() ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {concept.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800"
        disabled={!selectedValue || disabled}
      >
        Submit Guess
      </Button>
    </form>
  )
}
