"use client"

import { PredictionStats } from "@/components/prediction-stats"
import { RegistrySection } from "@/components/registry-section"

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

interface UserPredictionCardProps {
  prediction: PredictionRecord
  registries?: Registry[]
}

export function UserPredictionCard({ prediction, registries }: UserPredictionCardProps) {
  return (
    <div className="text-center py-6">
      <div className="text-4xl mb-4">{prediction.prediction === "boy" ? "💙" : "💖"}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {prediction.name}!</h3>
      <p className="text-slate-900 text-lg md:text-xl font-semibold mx-auto max-w-xl leading-relaxed bg-white/70 px-4 py-2 rounded-xl shadow-sm">
        Your prediction for{" "}
        <span className="font-extrabold text-slate-900">
          {prediction.prediction === "boy" ? "BOY" : "GIRL"}
        </span>{" "}
        is locked in.
      </p>

      <div className="mt-8">
        <PredictionStats userPrediction={prediction.prediction} />
      </div>

      {registries && registries.length > 0 && (
        <RegistrySection registries={registries} />
      )}
    </div>
  )
}
