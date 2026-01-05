export function AnkaraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient base layer - purple/blue to pink/orange/yellow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-pink-700 to-amber-500" />

      {/* Subtle Ankara pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="ankara-subtle" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Diamond shapes */}
            <path d="M50,0 L100,50 L50,100 L0,50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M50,20 L80,50 L50,80 L20,50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M50,35 L65,50 L50,65 L35,50 Z" fill="currentColor" opacity="0.3" />

            {/* Triangular accents */}
            <path d="M0,0 L25,0 L0,25 Z" fill="currentColor" opacity="0.2" />
            <path d="M100,0 L100,25 L75,0 Z" fill="currentColor" opacity="0.2" />
            <path d="M0,100 L0,75 L25,100 Z" fill="currentColor" opacity="0.2" />
            <path d="M100,100 L75,100 L100,75 Z" fill="currentColor" opacity="0.2" />

            {/* Decorative lines */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ankara-subtle)" className="text-white" />
      </svg>
    </div>
  )
}
