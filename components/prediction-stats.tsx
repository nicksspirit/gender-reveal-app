"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface PredictionStatsProps {
  userPrediction: "boy" | "girl"
  actualGender?: "boy" | "girl" | null
}

export function PredictionStats({ userPrediction, actualGender }: PredictionStatsProps) {
  const [stats, setStats] = useState<{ boy: number; girl: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      // Get all predictions to count
      // In a larger app, we would use a stored procedure or an edge function for this aggregation
      // but for this scale, client-side counting or a simple select count is fine.
      const { data, error } = await supabase
        .from("predictions")
        .select("prediction")

      if (error) {
        console.error("Error fetching stats:", error)
        setLoading(false)
        return
      }

      const boyCount = data.filter((p) => p.prediction === "boy").length
      const girlCount = data.filter((p) => p.prediction === "girl").length

      setStats({ boy: boyCount, girl: girlCount })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="mt-8 animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  const total = stats.boy + stats.girl
  const boyPercentage = total > 0 ? Math.round((stats.boy / total) * 100) : 0
  const girlPercentage = total > 0 ? Math.round((stats.girl / total) * 100) : 0

  const userPercentage = userPrediction === "boy" ? boyPercentage : girlPercentage
  const majorityPrediction = stats.boy > stats.girl ? "boy" : stats.girl > stats.boy ? "girl" : "tie"
  const isMajority = userPrediction === majorityPrediction

  const renderMessage = () => {
    const isFirstVoter = total === 1

    if (actualGender) {
      const isCorrect = userPrediction === actualGender
      return (
        <div className="space-y-3">
          <p className="text-slate-800 text-lg">
            Oh interesting! We&apos;re curious to know why you thought it was a <span className="font-bold uppercase">{userPrediction}</span>! 🧐
          </p>

          <div className="pt-2 border-t border-gray-100 mt-2">
            {isCorrect ? (
              <p className="text-2xl font-black text-green-600 drop-shadow-sm">
                Turns out... You were right! 🎉
              </p>
            ) : (
              <p className="text-2xl font-black text-slate-700 drop-shadow-sm">
                Turns out... It was a {actualGender}! 😅
              </p>
            )}

            <p className="text-sm text-gray-600 mt-2 font-medium">
              {isFirstVoter
                ? "You're the very first person to share your guess! 🌟"
                : `You joined ${userPercentage}% of voters who ${isCorrect ? 'also guessed correctly' : 'made the same prediction'}.`}
            </p>
          </div>
        </div>
      )
    }

    // Fallback for when gender isn't revealed yet
    return (
      <div className="space-y-2">
        <p className="text-slate-800 text-lg">
          Oh interesting! We&apos;re curious to know why you thought it was a <span className="font-bold uppercase">{userPrediction}</span>! 🧐
        </p>
        <p className="text-gray-700 mt-3 pt-2 border-t border-gray-100">
          You&apos;re in the <span className="font-bold text-xl">{userPercentage}%</span>
          {isMajority && majorityPrediction !== "tie" ? (
              " majority! Great minds think alike? 🧠"
          ) : majorityPrediction === "tie" ? (
              " of voters. It's a dead heat! 🔥"
          ) : (
              " minority. A bold choice! Only time will tell... 🕵🏾‍♂️"
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10 p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Prediction Stats</h3>

      <div className="space-y-6">
        {/* Bar Graph */}
        <div className="flex h-14 w-full rounded-xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
          <div
            style={{ width: `${boyPercentage}%` }}
            className="bg-blue-600 flex items-center justify-center text-white font-bold text-lg transition-all duration-1000 ease-out shadow-[inset_-2px_0_4px_rgba(0,0,0,0.1)]"
          >
            {boyPercentage > 10 && <span className="drop-shadow-md">{boyPercentage}%</span>}
          </div>
          <div
            style={{ width: `${girlPercentage}%` }}
            className="bg-pink-600 flex items-center justify-center text-white font-bold text-lg transition-all duration-1000 ease-out shadow-[inset_2px_0_4px_rgba(0,0,0,0.1)]"
          >
            {girlPercentage > 10 && <span className="drop-shadow-md">{girlPercentage}%</span>}
          </div>
        </div>

        <div className="flex justify-between text-base font-bold text-gray-800 px-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600 border border-blue-700"></span>
            <span>Boy ({stats.boy})</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Girl ({stats.girl})</span>
            <span className="w-4 h-4 rounded-full bg-pink-600 border border-pink-700"></span>
          </div>
        </div>

        {/* Fun text */}
        <div className="pt-6 border-t border-gray-200/60 text-center">
          <div className="text-gray-800 font-medium leading-relaxed">
            {renderMessage()}
          </div>
        </div>
      </div>
    </div>
  )
}
