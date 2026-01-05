"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  initialCountdownDate: string
}

export function CountdownTimer({ initialCountdownDate }: CountdownTimerProps) {
  const parseAsLocalDate = (dateString: string) => {
    const date = new Date(dateString)
    // Get the UTC date parts and create a local date at end of day
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDate()
    // Set to end of day (11:59:59 PM) in local timezone
    return new Date(year, month, day, 23, 59, 59)
  }

  const [countdownDate, setCountdownDate] = useState<Date>(parseAsLocalDate(initialCountdownDate))
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("reveal_state_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reveal_state",
        },
        (payload) => {
          if (payload.new && "countdown_date" in payload.new) {
            setCountdownDate(parseAsLocalDate(payload.new.countdown_date as string))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Calculate and update time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = countdownDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [countdownDate])

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  const formattedDueDate = new Date(initialCountdownDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-white/90 text-lg sm:text-xl font-medium tracking-wide">Baby Arriving On</p>
      <p className="text-white text-2xl sm:text-3xl font-bold">{formattedDueDate}</p>

      <div className="bg-blue-600 rounded-2xl p-4 sm:p-6 shadow-xl mt-2">
        <div className="flex gap-2 sm:gap-4">
          <TimeBlock value={formatNumber(timeLeft.days)} label="DAYS" />
          <TimeBlock value={formatNumber(timeLeft.hours)} label="HOURS" />
          <TimeBlock value={formatNumber(timeLeft.minutes)} label="MINUTES" />
          <TimeBlock value={formatNumber(timeLeft.seconds)} label="SECONDS" />
        </div>
      </div>

      <p className="text-white/70 text-sm mt-2">until we meet our little one</p>
    </div>
  )
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Dark box with yellow border */}
      <div className="bg-slate-900 border-2 border-yellow-400 rounded-lg px-3 sm:px-6 py-3 sm:py-4">
        <span className="text-white font-bold text-3xl sm:text-5xl md:text-6xl font-mono">{value}</span>
      </div>
      <span className="text-white text-[10px] sm:text-xs mt-2 font-medium tracking-wider">{label}</span>
    </div>
  )
}
