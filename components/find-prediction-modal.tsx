"use client"

import type React from "react"

import { useState } from "react"
import { getPredictionByEmail } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PredictionRecord {
  id: string
  name: string
  email: string
  prediction: "boy" | "girl"
  created_at: string
}

interface FindPredictionModalProps {
  onFound: (prediction: PredictionRecord) => void
}

export function FindPredictionModal({ onFound }: FindPredictionModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.")
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const result = await getPredictionByEmail(trimmedEmail)

      if (!result.success) {
        setError("Couldn't connect. Please check your internet and try again.")
        return
      }

      if (!result.data) {
        setError("We couldn't find a prediction with that email. Would you like to make one?")
        return
      }

      onFound(result.data)
      setOpen(false)
      setEmail("")
    } catch (err) {
      console.error(err)
      setError("Couldn't connect. Please check your internet and try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setEmail("")
      setError(null)
      setIsSearching(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-slate-800 font-semibold">
          Already voted? Find my prediction
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95">
        <DialogHeader>
          <DialogTitle>Find my prediction</DialogTitle>
          <DialogDescription>
            Enter the email you used to vote and we&apos;ll pull up your results.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="find-email">Email address</Label>
            <Input
              id="find-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-white"
            />
            {error && (
              <p className="text-sm text-white bg-red-600/90 px-3 py-1 rounded-md inline-block">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Find my prediction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
