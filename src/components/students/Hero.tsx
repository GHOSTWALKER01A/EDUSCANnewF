import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

type Props = { onHeroInViewChange?: (v: boolean) => void }

export default function Hero({ onHeroInViewChange }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  return (
    <section ref={ref} className="relative w-full h-[100svh] overflow-hidden">
      <motion.video
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover scale-105"
        src="/intro.mp4" 
        onViewportEnter={() => onHeroInViewChange?.(true)}
        onViewportLeave={() => onHeroInViewChange?.(false)}
      />

      {/* Improved premium gradient overlay with darker edges for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/80 via-[var(--bg-primary)]/30 to-[var(--bg-primary)] flex flex-col items-center justify-center pointer-events-none" />

      {/* Animated scroll down indicator */}
      <div className="absolute bottom-12 w-full flex justify-center z-10">
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          aria-hidden
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent)] drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]">Scroll to explore</span>
          <div className="p-3 rounded-full bg-[var(--bg-primary)]/40 backdrop-blur-md border border-[var(--border-color)]/30 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]">
            <ArrowDown className="w-6 h-6 text-[var(--accent)]" strokeWidth={2} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
