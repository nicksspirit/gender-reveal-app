"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitPrediction } from "@/app/actions"
import { FindPredictionModal } from "@/components/find-prediction-modal"

interface ValidationErrors {
  name?: string
  email?: string
  prediction?: string
}

interface PredictionRecord {
  id: string
  name: string
  email: string
  prediction: "boy" | "girl"
  created_at: string
}

interface PredictionFormProps {
  onPredictionSuccess?: (prediction: PredictionRecord) => void
  onPredictionFound?: (prediction: PredictionRecord) => void
}

export function PredictionForm({ onPredictionSuccess, onPredictionFound }: PredictionFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [prediction, setPrediction] = useState<"boy" | "girl" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({
    name: false,
    email: false,
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateField = (field: "name" | "email", value: string): string | undefined => {
    if (field === "name") {
      if (!value.trim()) return "Name is required"
      if (value.trim().length < 2) return "Name must be at least 2 characters"
      return undefined
    }
    if (field === "email") {
      if (!value.trim()) return "Email is required"
      if (!validateEmail(value.trim())) return "Please enter a valid email address"
      return undefined
    }
  }

  const handleBlur = (field: "name" | "email") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === "name" ? name : email
    const error = validateField(field, value)
    setValidationErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (touched.name) {
      const error = validateField("name", value)
      setValidationErrors((prev) => ({ ...prev, name: error }))
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (touched.email) {
      const error = validateField("email", value)
      setValidationErrors((prev) => ({ ...prev, email: error }))
    }
  }

  const handlePredictionSelect = (value: "boy" | "girl") => {
    setPrediction(value)
    setValidationErrors((prev) => ({ ...prev, prediction: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nameError = validateField("name", name)
    const emailError = validateField("email", email)
    const predictionError = !prediction ? "Please select a prediction" : undefined

    const errors: ValidationErrors = {
      name: nameError,
      email: emailError,
      prediction: predictionError,
    }

    setValidationErrors(errors)
    setTouched({ name: true, email: true })

    if (nameError || emailError || predictionError) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitPrediction(name, email, prediction)

      if (!result.success) {
        if (result.error === "EMAIL_EXISTS") {
          setError("You've already made a prediction! Use 'Find My Prediction' to see it.")
        } else {
          setError("Failed to submit prediction. Please try again.")
        }
        setIsSubmitting(false)
        return
      }

      if (onPredictionSuccess && result.data) {
        onPredictionSuccess(result.data)
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = name.trim().length >= 2 && validateEmail(email.trim()) && prediction !== null

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-900 font-medium">
          Your Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={() => handleBlur("name")}
          className={`bg-white/60 border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-gray-500 ${
            validationErrors.name && touched.name ? "border-red-500 focus:border-red-500" : ""
          }`}
          aria-invalid={!!validationErrors.name && touched.name}
          aria-describedby={validationErrors.name ? "name-error" : undefined}
        />
        {validationErrors.name && touched.name && (
          <p id="name-error" className="text-white text-sm mt-1 bg-red-600/90 px-3 py-1 rounded-md inline-block">
            {validationErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900 font-medium">
          Your Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={() => handleBlur("email")}
          className={`bg-white/60 border-gray-300 text-gray-900 placeholder:text-gray-600 focus:border-gray-500 ${
            validationErrors.email && touched.email ? "border-red-500 focus:border-red-500" : ""
          }`}
          aria-invalid={!!validationErrors.email && touched.email}
          aria-describedby={validationErrors.email ? "email-error" : undefined}
        />
        {validationErrors.email && touched.email && (
          <p id="email-error" className="text-white text-sm mt-1 bg-red-600/90 px-3 py-1 rounded-md inline-block">
            {validationErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-gray-900 font-medium">Your Prediction</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handlePredictionSelect("boy")}
            className={`py-4 px-6 rounded-xl font-bold text-lg transition-all cursor-pointer ${
              prediction === "boy"
                ? "bg-blue-600 text-white ring-4 ring-blue-300 scale-105"
                : "bg-white/50 text-gray-900 hover:bg-white/70"
            }`}
          >
            💙 BOY
          </button>
          <button
            type="button"
            onClick={() => handlePredictionSelect("girl")}
            className={`py-4 px-6 rounded-xl font-bold text-lg transition-all cursor-pointer ${
              prediction === "girl"
                ? "bg-pink-600 text-white ring-4 ring-pink-300 scale-105"
                : "bg-white/50 text-gray-900 hover:bg-white/70"
            }`}
          >
            💖 GIRL
          </button>
        </div>
        {validationErrors.prediction && (
          <p className="text-white text-sm mt-1 bg-red-600/90 px-3 py-1 rounded-md inline-block mx-auto">
            {validationErrors.prediction}
          </p>
        )}
      </div>

      {error && (
        <p className="text-white text-sm text-center bg-red-600/90 px-3 py-1 rounded-md inline-block mx-auto">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full bg-purple-700 text-white hover:bg-purple-800 font-bold py-6 text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Prediction"}
      </Button>

      {onPredictionFound && (
        <div className="text-center">
          <FindPredictionModal onFound={onPredictionFound} />
        </div>
      )}
    </form>
  )
}
