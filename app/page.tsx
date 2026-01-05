import { createClient } from "@/lib/supabase/server"
import { AnkaraBackground } from "@/components/ankara-background"
import { BoyOrGirlTitle } from "@/components/boy-or-girl-title"
import { CountdownTimer } from "@/components/countdown-timer"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { PredictionForm } from "@/components/prediction-form"
import { OurStorySection } from "@/components/our-story-section"

export default async function Home() {
  const supabase = await createClient()

  // Fetch the reveal state from database
  const { data: revealState } = await supabase.from("reveal_state").select("*").single()

  const countdownDate = revealState?.countdown_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  return (
    <main className="relative">
      {/* Ankara pattern background */}
      <AnkaraBackground />

      {/* Hero section */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-12">
        {/* Main title */}
        <BoyOrGirlTitle />

        {/* Countdown timer */}
        <div className="mt-8 sm:mt-12">
          <CountdownTimer initialCountdownDate={countdownDate} />
        </div>

        {/* Couple names */}
        <div className="mt-10 sm:mt-14 text-center">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">Uzoma & Maame</h2>
          <p className="text-white/70 text-base sm:text-lg mt-2">Our First Child</p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 sm:mt-14">
          <ScrollIndicator />
        </div>
      </section>

      {/* Our Story section */}
      <OurStorySection />

      {/* Prediction form section */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <div className="relative w-full max-w-2xl">
          {/* Background card - lower z-index */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30"></div>

          {/* Form content - higher z-index */}
          <div className="relative z-10 rounded-3xl p-10 sm:p-16 md:p-20">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Make Your Prediction</h2>
              <p className="text-gray-700 text-base sm:text-lg">Will it be a boy or a girl? Cast your vote!</p>
            </div>

            <PredictionForm />
          </div>
        </div>
      </section>
    </main>
  )
}
