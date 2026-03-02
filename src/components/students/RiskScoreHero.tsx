
import React from 'react'
import { motion } from 'framer-motion'

export default function RiskScore() {
  const risk = 60 // example percent
  const color = risk >= 75 ? 'bg-red-500' : risk >= 50 ? 'bg-yellow-400' : 'bg-green-500'
  const message = risk >= 75 ? 'High risk: Improve attendance' : risk >= 50 ? 'Moderate risk: Please act' : 'Low risk: Good work'

  return (
    <motion.section
      id="risk"
      className="py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow flex flex-col md:flex-row items-center gap-6">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center ${color} text-white text-xl font-bold`}>
          {risk}%
        </div>
        <div>
          <h3 className="text-xl font-semibold">Risk Score</h3>
          <p className="text-[var(--text-secondary)] mt-2 max-w-xl">{message}</p>

          <div className="mt-4">
            <div className="h-3 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div style={{ width: `${risk}%` }} className="h-full bg-[var(--accent)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Your attendance contribution is the largest factor.</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
