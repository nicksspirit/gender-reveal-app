"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { getPredictionByEmail } from "@/app/actions"

const STORAGE_KEY = "gender_reveal_user_email"

interface PredictionRecord {
  id: string
  name: string
  email: string
  prediction: "boy" | "girl"
  created_at: string
}

interface PredictionContextType {
  userPrediction: PredictionRecord | null
  isLoading: boolean
  setUserPrediction: (prediction: PredictionRecord | null) => void
  refreshPrediction: () => Promise<void>
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined)

export function PredictionProvider({ children }: { children: React.ReactNode }) {
  const [userPrediction, setUserPrediction] = useState<PredictionRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshPrediction = async () => {
    setIsLoading(true)
    try {
      const savedEmail = localStorage.getItem(STORAGE_KEY)
      if (savedEmail) {
        const result = await getPredictionByEmail(savedEmail)
        if (result.success && result.data) {
          setUserPrediction(result.data)
        } else {
          localStorage.removeItem(STORAGE_KEY)
          setUserPrediction(null)
        }
      } else {
        setUserPrediction(null)
      }
    } catch (error) {
      console.error("Error fetching prediction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial check on mount
  useEffect(() => {
    refreshPrediction()
  }, [])

  // Sync state changes to localStorage
  const handleSetPrediction = (prediction: PredictionRecord | null) => {
    setUserPrediction(prediction)
    if (prediction) {
      localStorage.setItem(STORAGE_KEY, prediction.email.toLowerCase())
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <PredictionContext.Provider
      value={{
        userPrediction,
        isLoading,
        setUserPrediction: handleSetPrediction,
        refreshPrediction,
      }}
    >
      {children}
    </PredictionContext.Provider>
  )
}

export function usePrediction() {
  const context = useContext(PredictionContext)
  if (context === undefined) {
    throw new Error("usePrediction must be used within a PredictionProvider")
  }
  return context
}
