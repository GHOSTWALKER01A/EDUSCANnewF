// src/components/student/StatsGrid.tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Props = {
  upcomingCount: number
  assignmentsCount: number
  avgGrade: number | string
  autoStatus: { checks: number; total: number }
  onAssignmentsClick: () => void
  onGradesClick: () => void
}

export default function StatsGrid({ upcomingCount, assignmentsCount, avgGrade, autoStatus, onAssignmentsClick, onGradesClick }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div whileHover={{ y: -4 }} className="bg-[var(--bg-secondary)] p-4 rounded-lg">
        <h3 className="text-lg text-[var(--accent)] font-semibold">Upcoming Classes</h3>
        <p className="text-[var(--text-secondary)] mt-2">{upcomingCount} today</p>
      </motion.div>
      <motion.div whileHover={{ y: -4 }} onClick={onAssignmentsClick} className="bg-[var(--bg-secondary)] p-4 rounded-lg cursor-pointer">
        <h3 className="text-lg text-[var(--accent)] font-semibold">Assignments</h3>
        <p className="text-[var(--text-secondary)] mt-2">{assignmentsCount} active</p>
      </motion.div>
      <motion.div whileHover={{ y: -4 }} className="bg-[var(--bg-secondary)] p-4 rounded-lg">
        <h3 className="text-lg text-[var(--accent)] font-semibold">Grades Overview</h3>
        <p className="text-[var(--text-secondary)] mt-2">{avgGrade} CGPA</p>
        <button onClick={onGradesClick} className="mt-3 text-sm text-[var(--accent)] underline">View details</button>
      </motion.div>
      <motion.div whileHover={{ y: -4 }} className="bg-[var(--bg-secondary)] p-4 rounded-lg">
        <h3 className="text-lg text-[var(--accent)] font-semibold">Auto Attendance</h3>
        <p className="text-[var(--text-secondary)] mt-2">Checks: {autoStatus.checks}/{autoStatus.total}</p>
      </motion.div>
    </div>
  )
}
