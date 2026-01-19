"use client"

import { usePrediction } from "@/components/prediction-context"
import { PredictionForm } from "@/components/prediction-form"
import { UserPredictionCard } from "@/components/user-prediction-card"
import { Skeleton } from "@/components/ui/skeleton"

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
  const { userPrediction, isLoading, setUserPrediction } = usePrediction()

  const handlePredictionSaved = (prediction: PredictionRecord) => {
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
