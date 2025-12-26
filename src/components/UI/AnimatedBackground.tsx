'use client'

import { motion } from 'framer-motion'



export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* large blurred gradient */}
      <div className="absolute -left-20 -top-20 w-[720px] h-[720px] rounded-full blur-[80px] opacity-60" style={{ background: 'linear-gradient(135deg, rgba(10,132,255,0.18), rgba(6,182,212,0.12))' }} />

      {/* animated SVG blobs */}
      <svg className="absolute right-0 top-12 w-[680px] h-[680px] opacity-40" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#F5DEB3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E6C797" stopOpacity="0.95" />
          </linearGradient>
          <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        <motion.g filter="url(#f1)">
          <motion.path
            d="M430 60C490 120 540 190 526 272C512 354 427 452 357 499C287 546 178 546 110 498C42 450 16 353 34 260C52 167 102 84 180 62C258 40 370 0 430 60Z"
            fill="url(#g1)"
            initial={{ translateY: -8, rotate: -6 }}
            animate={{ translateY: 10, rotate: 6 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 8, ease: 'easeInOut' }}
            style={{ transformOrigin: '50% 50%' }}
          />
          <motion.path
            d="M130 480C190 520 270 540 338 518C406 496 460 430 476 356C492 282 464 212 415 174C366 136 288 150 212 158C136 166 88 236 98 304C108 372 70 444 130 480Z"
            fill="rgba(10,132,255,0.06)"
            initial={{ translateY: 8, rotate: 4 }}
            animate={{ translateY: -12, rotate: -4 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 10, ease: 'easeInOut' }}
            style={{ transformOrigin: '50% 50%' }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
