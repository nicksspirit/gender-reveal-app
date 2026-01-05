"use client"

import { ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

export function ScrollIndicator() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <motion.button
      onClick={scrollToContent}
      className="flex flex-col items-center gap-1 text-white/90 hover:text-white transition-colors cursor-pointer"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      aria-label="Scroll to content"
    >
      <ArrowDown className="w-6 h-6" />
    </motion.button>
  )
}
