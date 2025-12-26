// src/components/student/AnimatedBackground.tsx
'use client'
import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -left-20 -top-20 w-[700px] h-[700px] rounded-full blur-[80px] opacity-60"
        style={{ background: 'linear-gradient(135deg,#0A84FF33,#06B6D433)' }}
      />
      <svg className="absolute right-0 top-12 w-[600px] h-[600px] opacity-40" viewBox="0 0 600 600" aria-hidden>
        <defs>
          <linearGradient id="gA" x1="0" x2="1">
            <stop offset="0%" stopColor="#F5DEB3" />
            <stop offset="100%" stopColor="#E6C797" />
          </linearGradient>
        </defs>
        <motion.path
          d="M430 60C490 120 540 190 526 272C512 354 427 452 357 499C287 546 178 546 110 498C42 450 16 353 34 260C52 167 102 84 180 62C258 40 370 0 430 60Z"
          fill="url(#gA)"
          initial={{ rotate: -6, y: -8 }}
          animate={{ rotate: 6, y: 10 }}
          transition={{ duration: 9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          style={{ transformOrigin: '50% 50%' }}
        />
      </svg>
    </div>
  )
}
