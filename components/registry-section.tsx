"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Registry {
  id: string
  name: string
  url: string
}

interface RegistrySectionProps {
  registries: Registry[]
}

export function RegistrySection({ registries }: RegistrySectionProps) {
  if (!registries || registries.length === 0) return null

  return (
    <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200/60"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-6 py-2 text-slate-900 text-lg font-medium bg-white/50 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
            Thank you for your love & support! 🎁
          </span>
        </div>
      </div>

      <p className="text-slate-800 text-sm md:text-base max-w-lg mx-auto mb-6 leading-relaxed font-medium">
        Your presence in our lives is the greatest gift. If you wish to help us prepare for our little one, we&apos;ve registered at these stores:
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {registries.map((registry) => (
          <Button
            key={registry.id}
            asChild
            variant="secondary"
            className="bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-full h-12 px-8 shadow-md hover:shadow-lg transition-all hover:scale-105 border border-slate-200"
          >
            <a href={registry.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              {registry.name}
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
