// src/components/student/StatusCard.tsx
'use client'
import React from 'react'
import ProgressRing from './Progress'
import TipsCarousel from './TipstoImprove'
import { StudentMetrics } from '../../types/metrics'
import { motion } from 'framer-motion'

function statusFromPercent(p: number) {
  if (p >= 75) return { label: 'Green', color: '#18A357', emoji: '😄' }
  if (p >= 60) return { label: 'Yellow', color: '#F59E0B', emoji: '😐' }
  return { label: 'Red', color: '#DC2626', emoji: '😟' }
}

export default function StatusCard({ metrics }: { metrics: StudentMetrics }) {
  const s = statusFromPercent(metrics.attendancePercent)
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-[0_8px_24px_var(--shadow)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${s.color}20, transparent)` }}>
            <div className="text-4xl">{s.emoji}</div>
          </div>
          <div>
            <div className="text-sm text-[var(--text-secondary)]">Your Current Status</div>
            <h2 className="text-2xl font-bold text-[var(--accent)]">{s.label}</h2>
            <p className="text-sm mt-1">You are currently <strong className="capitalize">{s.label}</strong>. Just improve attendance to go Green!</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <ProgressRing percentage={metrics.attendancePercent} label="Attendance" />
          <ProgressRing percentage={metrics.academicScore} label="Academic" color="#7C3AED" />
          <ProgressRing percentage={metrics.feeStatusPercent} label="Fees" color="#06B6D4" />
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-[rgba(255,255,255,0.04)]">
              <div className="text-xs text-[var(--text-secondary)]">Points</div>
              <div className="text-lg font-bold">{metrics.points}</div>
            </div>
          </div>
          <div className="w-60">
            <TipsCarousel tips={metrics.tips} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
