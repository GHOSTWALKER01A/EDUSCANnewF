// components/AttendanceStats.tsx
import React from 'react'
import { motion } from 'framer-motion'
import ProgressRing from './ProgressRing'

export default function AttendanceStats() {
  const stats = [
    { label: 'Attendance', value: 74, color: '#10B981' },
    { label: 'Academic Score', value: 82, color: '#3B82F6' },
    { label: 'Fee Coverage', value: 95, color: '#F59E0B' }
  ]

  return (
    <motion.section
      id="attendance"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-[var(--accent)]">Your Current Status</h3>
      <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">Overview of attendance, academic score, and fees.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--card-bg)] p-6 rounded-xl flex items-center gap-6 shadow">
            <div>
              <ProgressRing progress={s.value} color={s.color} radius={48} stroke={8} />
            </div>
            <div>
              <h4 className="text-xl font-semibold">{s.label}</h4>
              <div className="text-2xl font-bold text-[var(--accent)]">{s.value}%</div>
              <div className="text-sm text-[var(--text-secondary)] mt-1">Updated just now</div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
