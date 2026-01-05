"use client"

import { useState, useEffect } from "react"
import { updateRevealSettings } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AdminFormProps {
  initialDueDate: string
  initialGender: "boy" | "girl" | null
  initialIsRevealed: boolean
}

export function AdminForm({ initialDueDate, initialGender, initialIsRevealed }: AdminFormProps) {
  const [dueDate, setDueDate] = useState(initialDueDate.split("T")[0])
  const [gender, setGender] = useState<"boy" | "girl" | null>(initialGender)
  const [isRevealed, setIsRevealed] = useState(initialIsRevealed)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    setDueDate(initialDueDate.split("T")[0])
    setGender(initialGender)
    setIsRevealed(initialIsRevealed)
  }, [initialDueDate, initialGender, initialIsRevealed])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    console.log("Saving admin settings:", { dueDate, gender, isRevealed })

    try {
      const result = await updateRevealSettings(dueDate, gender, isRevealed)

      if (result.success) {
        console.log("Successfully saved changes")
        setMessage({ type: "success", text: result.message })
      } else {
        console.error("Error saving changes:", result.message)
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Due Date Section */}
      <div className="space-y-3">
        <Label htmlFor="dueDate" className="text-lg font-semibold text-slate-900">
          Baby Due Date
        </Label>
        <p className="text-sm text-slate-500">
          This date will be displayed in the countdown timer on the landing page.
        </p>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Gender Section */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-slate-900">Baby Gender</Label>
        <p className="text-sm text-slate-500">Select the gender to reveal when the countdown ends.</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setGender("boy")}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all cursor-pointer ${
              gender === "boy"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Boy
          </button>
          <button
            type="button"
            onClick={() => setGender("girl")}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all cursor-pointer ${
              gender === "girl"
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Girl
          </button>
        </div>
      </div>

      {/* Reveal Toggle Section */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-slate-900">Reveal Status</Label>
        <p className="text-sm text-slate-500">
          Toggle this on when you&apos;re ready to reveal the gender to everyone.
        </p>
        <button
          type="button"
          onClick={() => setIsRevealed(!isRevealed)}
          className={`relative w-16 h-8 rounded-full transition-colors cursor-pointer ${isRevealed ? "bg-green-500" : "bg-slate-300"}`}
        >
          <span
            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
              isRevealed ? "translate-x-9" : "translate-x-1"
            }`}
          />
        </button>
        <p className={`text-sm font-medium ${isRevealed ? "text-green-600" : "text-slate-500"}`}>
          {isRevealed ? "Gender is revealed!" : "Gender is hidden"}
        </p>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-slate-200">
        {message && (
          <p className={`mb-4 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}