"use client"

import { useState } from "react"
import { PredictionForm } from "@/components/prediction-form"
import { GenderRevealCard } from "@/components/gender-reveal-card"

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
  const [hasPredicted, setHasPredicted] = useState(false)
  const [userPrediction, setUserPrediction] = useState<"boy" | "girl" | undefined>(undefined)

  // If the user has submitted their prediction AND the reveal is live, show the card.
  if (hasPredicted && isRevealed) {
    return <GenderRevealCard gender={gender} userPrediction={userPrediction} registries={registries} />
  }

  // Otherwise, show the prediction form.
  // Note: PredictionForm handles its own "Thank you" state internally.
  // We hide the title if the user has predicted (to match the "Thank you" view).
  
  return (
    <>
      {/* Background card - lower z-index */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30"></div>

      {/* Form content - higher z-index */}
      <div className="relative z-10 rounded-3xl p-10 sm:p-16 md:p-20">
        {!hasPredicted && (
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Make Your Prediction</h2>
            <p className="text-gray-700 text-base sm:text-lg">Will it be a boy or a girl? Cast your vote!</p>
          </div>
        )}

        <PredictionForm 
          onPredictionSuccess={(prediction) => {
            setUserPrediction(prediction)
            setHasPredicted(true)
          }}
          registries={registries}
        />
      </div>
    </>
  )
}
