"use client"

import { useEffect, useState } from "react"
import { getPredictionByEmail } from "@/app/actions"
import { PredictionForm } from "@/components/prediction-form"
import { UserPredictionCard } from "@/components/user-prediction-card"
import { Skeleton } from "@/components/ui/skeleton"

const STORAGE_KEY = "gender_reveal_user_email"

interface Registry {
  id: string
  name: string
  url: string
}

interface PredictionRecord {
  id: string
  name: string
  email: string
  prediction: "boy" | "girl"
  created_at: string
}

interface PredictionSectionProps {
  registries: Registry[]
  onPredictionSaved?: (prediction: PredictionRecord) => void
}

export function PredictionSection({ registries, onPredictionSaved }: PredictionSectionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [userPrediction, setUserPrediction] = useState<PredictionRecord | null>(null)

  useEffect(() => {
    let isMounted = true

    async function checkReturningUser() {
      try {
        const savedEmail = localStorage.getItem(STORAGE_KEY)
        if (savedEmail) {
          const result = await getPredictionByEmail(savedEmail)
          if (!isMounted) return

          if (result.success && result.data) {
            setUserPrediction(result.data)
            return
          }

          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkReturningUser()

    return () => {
      isMounted = false
    }
  }, [])

  const handlePredictionSaved = (prediction: PredictionRecord) => {
    try {
      localStorage.setItem(STORAGE_KEY, prediction.email.toLowerCase())
    } catch (error) {
      console.error(error)
    }
    setUserPrediction(prediction)
    onPredictionSaved?.(prediction)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (userPrediction) {
    return <UserPredictionCard prediction={userPrediction} registries={registries} />
  }

  return (
    <PredictionForm onPredictionSuccess={handlePredictionSaved} onPredictionFound={handlePredictionSaved} />
  )
}
