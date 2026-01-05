import Image from "next/image"

export function OurStorySection() {
  return (
    <section className="relative py-20 px-4">
      {/* Section header */}
      <div className="text-center mb-16">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Our Journey</h2>
        <p className="text-white/70 text-base sm:text-lg max-w-md mx-auto">
          A love story that&apos;s about to get even sweeter
        </p>
      </div>

      {/* Story cards */}
      <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {/* Card 1: Couple photo */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <Image
              src="/images/20251230-093456-img-style.jpg"
              alt="Oil painting style portrait of Uzoma and Maame"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4">Two Hearts, One Love</h3>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              A few months after getting to know each other, we knew we were meant to build a life together. Through
              every laugh, every adventure, and every quiet moment, our love has only grown stronger. Now, we&apos;re
              ready for our greatest adventure yet.
            </p>
          </div>
        </div>

        {/* Card 2: Baby bump - reversed layout */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <Image
              src="/images/whatsapp-20image-202025-12-24-20at-2010.jpeg"
              alt="Maame showing her beautiful baby bump"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4">Blooming with Joy</h3>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              Every day brings new wonder as we watch our little miracle grow. Maame&apos;s glow says it all—our hearts
              are overflowing with anticipation and love for the tiny life we&apos;re about to meet.
            </p>
          </div>
        </div>

        {/* Card 3: Ultrasound - centered */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 bg-black">
            <Image
              src="/images/whatsapp-20image-202025-12-24-20at-2017.jpeg"
              alt="Ultrasound image of our first child"
              fill
              className="object-cover object-[center_45%] scale-150"
            />
          </div>
          <div className="text-center max-w-lg">
            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4">Our Little Miracle</h3>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              The first time we saw this tiny profile, our world changed forever. Ten little fingers, ten little toes,
              and one big question that&apos;s kept everyone guessing—is it a boy or a girl?
            </p>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center justify-center mt-20 gap-4">
        <div className="h-px w-16 bg-white/30"></div>
        <div className="text-white/50 text-2xl">♥</div>
        <div className="h-px w-16 bg-white/30"></div>
      </div>
    </section>
  )
}
