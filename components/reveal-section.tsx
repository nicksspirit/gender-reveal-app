"use client"

import { useEffect, useState } from "react"
import { getPredictionByEmail } from "@/app/actions"
import { GenderRevealCard } from "@/components/gender-reveal-card"
import { PredictionSection } from "@/components/prediction-section"

const STORAGE_KEY = "gender_reveal_user_email"

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
  const [isCheckingPrediction, setIsCheckingPrediction] = useState(true)
  const [userPrediction, setUserPrediction] = useState<"boy" | "girl" | undefined>(undefined)

  useEffect(() => {
    if (!isRevealed) return
    let isMounted = true

    async function loadPrediction() {
      try {
        const savedEmail = localStorage.getItem(STORAGE_KEY)
        if (!savedEmail) {
          setIsCheckingPrediction(false)
          return
        }

        const result = await getPredictionByEmail(savedEmail)
        if (!isMounted) return

        if (result.success && result.data) {
          setUserPrediction(result.data.prediction)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setIsCheckingPrediction(false)
        }
      }
    }

    loadPrediction()

    return () => {
      isMounted = false
    }
  }, [isRevealed])

  if (isRevealed && !isCheckingPrediction && userPrediction) {
    return <GenderRevealCard gender={gender} userPrediction={userPrediction} registries={registries} />
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

        <PredictionSection
          registries={registries}
          onPredictionSaved={(prediction) => {
            setUserPrediction(prediction.prediction)
            setIsCheckingPrediction(false)
          }}
        />
      </div>
    </>
  )
}
