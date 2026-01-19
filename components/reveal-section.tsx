"use client"

import { usePrediction } from "@/components/prediction-context"
import { GenderRevealCard } from "@/components/gender-reveal-card"
import { PredictionSection } from "@/components/prediction-section"

interface Registry {
  id: string
  name: string
  url: string
}

interface RevealSectionProps {
  isRevealed: boolean
  gender: "boy" | "girl" | null
  registries: Registry[]
}

export function RevealSection({ isRevealed, gender, registries }: RevealSectionProps) {
  const { userPrediction, isLoading } = usePrediction()

  if (isRevealed && !isLoading && userPrediction) {
    return <GenderRevealCard gender={gender} userPrediction={userPrediction.prediction} registries={registries} />
  }

  return (
    <>
      {/* Background card - lower z-index */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30"></div>

      {/* Form content - higher z-index */}
      <div className="relative z-10 rounded-3xl p-10 sm:p-16 md:p-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Make Your Prediction</h2>
          <p className="text-gray-700 text-base sm:text-lg">Will it be a boy or a girl? Cast your vote!</p>
        </div>

        <PredictionSection registries={registries} />
      </div>
    </>
  )
}
