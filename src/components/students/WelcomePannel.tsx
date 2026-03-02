
import React from 'react'
import { motion } from 'framer-motion'

type Props = { userName: string }

export default function WelcomePanel({ userName }: Props) {
  return (
    <motion.section
      id="welcome"
      className="pt-12 pb-12 bg-[var(--bg-primary)] z-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-full overflow-hidden 
       px-5 md:px-24 pt-15 pb-5 ">

        <div className="flex-1 text-center mx-10px p-[45px]">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--accent)]">Welcome, {userName} </h2>
          <p className="mt-3 mx-[210px] text-[var(--text-secondary)] max-w-xl font-bold">
            Good to see you — here’s your dashboard snapshot and latest college highlights.
          </p>
          {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--card-bg)] rounded-lg shadow">Quick stat — Attendance</div>
            <div className="p-4 bg-[var(--card-bg)] rounded-lg shadow">Quick stat — Points</div>
          </div> */}
        </div>
        <div className="flex-1 ">
          <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden shadow-lg">
            {/* Advertisement / big college video placeholder */}
            <motion.video src="/college.mp4" autoPlay muted playsInline loop 
            className="w-full h-[450px] object-cover min-h-[40px]" />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
