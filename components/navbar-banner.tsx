"use client"

import { usePrediction } from "@/components/prediction-context"
import { cn } from "@/lib/utils"

interface Registry {
  id: string
  name: string
  url: string
}

interface NavbarBannerProps {
  registries?: Registry[]
}

export function NavbarBanner({ registries = [] }: NavbarBannerProps) {
  const { userPrediction, isLoading } = usePrediction()

  if (isLoading || !userPrediction) return null

  const isBoy = userPrediction.prediction === "boy"

  return (
    <div
      className={cn(
        "w-full py-2 px-4 text-center text-white font-medium transition-colors duration-500 sticky top-0 z-50",
        isBoy ? "bg-blue-600" : "bg-pink-600"
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm sm:text-base">
        <span>Check out our registries:</span>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {registries.length > 0 ? (
            registries.map((registry, index) => (
              <div key={registry.id} className="flex items-center gap-4">
                {index > 0 && <span className="opacity-50 hidden sm:inline">|</span>}
                <a
                  href={registry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline decoration-white/70 hover:decoration-white transition-all"
                >
                  {registry.name}
                </a>
              </div>
            ))
          ) : (
            <span>Coming soon!</span>
          )}
        </div>
      </div>
    </div>
  )
}
