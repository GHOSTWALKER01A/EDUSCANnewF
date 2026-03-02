
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

type Props = { onHeroInViewChange?: (v: boolean) => void }

export default function Hero({ onHeroInViewChange }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  return (
    <section ref={ref} className="relative w-full h-screen">
      <motion.video
        autoPlay
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
        src="/intro.mp4" 
        onViewportEnter={() => onHeroInViewChange?.(true)}
        onViewportLeave={() => onHeroInViewChange?.(false)}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(2,6,23,0.7)] to-[rgba(2,6,23,0.2)] flex flex-col items-center justify-center">
        {/* <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-[var(--accent)] drop-shadow-lg text-center"
        >
          Empower Your Education
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-4 max-w-2xl text-center text-[var(--text-secondary)]"
        >
          Smart attendance, resources and student insights — all in one platform.
        </motion.p>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            // scroll down to next section smoothly
            window.scrollTo({ top: window.innerHeight - 30, behavior: 'smooth' })
          }}
          className="mt-10 px-6 py-3 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] font-semibold shadow-lg"
        >
          Explore
        </motion.button> */}

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-10"
          aria-hidden
        >
          <ArrowDown className="w-8 h-8 text-[var(--accent)] drop-shadow-[0_0_12px_rgba(0,212,255,0.8)]" strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  )
}
