"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"
import { PredictionStats } from "@/components/prediction-stats"
import { RegistrySection } from "@/components/registry-section"

interface Registry {
  id: string
  name: string
  url: string
}

interface GenderRevealCardProps {
  gender: "boy" | "girl" | null
  userPrediction?: "boy" | "girl"
  registries?: Registry[]
}

export function GenderRevealCard({ gender, userPrediction, registries }: GenderRevealCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!gender) {
    return (
      <div className="text-center p-10">
        <h2 className="text-3xl font-bold text-white">The secret is out...</h2>
        <p className="text-white/90 mt-4">But we can&apos;t quite see it yet!</p>
      </div>
    )
  }

  const isBoy = gender === "boy"
  const colorClass = isBoy ? "text-blue-500" : "text-pink-500"
  const bgGradient = isBoy 
    ? "from-blue-100 to-blue-50" 
    : "from-pink-100 to-pink-50"

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={1000}
            gravity={0.15}
            colors={isBoy ? ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb"] : ["#ec4899", "#f472b6", "#fbcfe8", "#db2777"]}
          />
        </div>
      )}
      
      <div 
        className={`
          transform transition-all duration-1000 ease-out
          ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}
          relative z-10 rounded-3xl p-10 sm:p-16 md:p-20
          bg-white/20 backdrop-blur-md
          border border-white/30
          shadow-xl
          text-center
          overflow-hidden
        `}
      >
        {/* Glossy shine effect */}
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Decorative inner glow */}
        <div className={`absolute inset-0 rounded-3xl opacity-10 bg-gradient-to-br ${bgGradient} -z-10`} />
        
        <div className="relative z-10">
          <div className="mb-6">
            <span className="text-slate-700 font-medium uppercase tracking-widest text-sm sm:text-base bg-white/60 px-4 py-1 rounded-full">
              It&apos;s official
            </span>
          </div>
        
          <h2 className={`
            text-6xl sm:text-7xl md:text-8xl font-black 
            ${colorClass}
            drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]
            mb-8
            animate-in zoom-in-50 duration-700 delay-300 fill-mode-backwards
            tracking-tight
            stroke-text
          `}>
            {isBoy ? "IT'S A BOY!" : "IT'S A GIRL!"}
          </h2>

          <div className="space-y-4">
            <p className="text-slate-800 text-lg sm:text-xl md:text-2xl font-bold">
              {isBoy 
                ? "We can't wait to meet our little prince!" 
                : "We can't wait to meet our little princess!"}
            </p>
            <p className="text-slate-700 font-medium">
              March 24, 2026
            </p>
          </div>

          <div className="mt-10 animate-bounce">
            <span className="text-5xl filter drop-shadow-md">
              {isBoy ? "💙 👶🏾 🚙" : "💗 👶🏾 🎀"}
            </span>
          </div>

          {userPrediction && (
            <div className="mt-8">
              <PredictionStats userPrediction={userPrediction} actualGender={gender} />
            </div>
          )}

          {registries && registries.length > 0 && (
            <RegistrySection registries={registries} />
          )}
        </div>
      </div>
      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 2px white;
          text-shadow: 4px 4px 0px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  )
}
