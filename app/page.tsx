import { createClient } from "@/lib/supabase/server"
import { AnkaraBackground } from "@/components/ankara-background"
import { BoyOrGirlTitle } from "@/components/boy-or-girl-title"
import { CountdownTimer } from "@/components/countdown-timer"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { RevealSection } from "@/components/reveal-section"
import { OurStorySection } from "@/components/our-story-section"

export default async function Home() {
  const supabase = await createClient()

  // Fetch the reveal state from database
  const { data: revealState } = await supabase.from("reveal_state").select("*").single()

  const countdownDate = revealState?.countdown_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const isRevealed = revealState?.is_revealed || false
  const gender = revealState?.gender as "boy" | "girl" | null

  // Fetch registries
  const { data: registries } = await supabase
    .from("registries")
    .select("*")
    .order("created_at", { ascending: true })

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
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center gap-4">
          <p className="text-white/90 text-lg sm:text-xl font-medium">Scroll down to learn more</p>
          <ScrollIndicator />
        </div>
      </section>

      {/* Our Story section */}
      <OurStorySection />

      {/* Reveal or Prediction section */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <div className="relative w-full max-w-2xl">
          <RevealSection isRevealed={isRevealed} gender={gender} registries={registries || []} />
        </div>
      </section>
    </main>
  )
}
