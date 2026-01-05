export function BoyOrGirlTitle() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {/* BOY text - solid blue with white glow shadow */}
      <span
        className="font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight"
        style={{
          color: "#3b5998",
          textShadow: "0px 0px 20px rgba(255,255,255,0.5), 4px 4px 0px rgba(0,0,0,0.2)",
        }}
      >
        BOY
      </span>

      {/* "or" text - white */}
      <span className="text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl">or</span>

      {/* GIRL text - solid pink with white glow shadow */}
      <span
        className="font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight"
        style={{
          color: "#db2777",
          textShadow: "0px 0px 20px rgba(255,255,255,0.5), 4px 4px 0px rgba(0,0,0,0.2)",
        }}
      >
        GIRL
      </span>
    </div>
  )
}
