// src/components/student/StatusCard.tsx
'use client'
import React from 'react'
import ProgressRing from './Progress'
import TipsCarousel from './TipstoImprove'
import { StudentMetrics } from '../../types/metrics'
import { motion } from 'framer-motion'
import { Award, Zap } from 'lucide-react'

function statusFromPercent(p: number) {
  if (p >= 75) return { label: 'Green', color: '#10b981', emoji: '🌟', textClass: 'text-emerald-500' }
  if (p >= 60) return { label: 'Yellow', color: '#f59e0b', emoji: '⭐', textClass: 'text-amber-500' }
  return { label: 'Red', color: '#ef4444', emoji: '⚠️', textClass: 'text-rose-500' }
}

export default function StatusCard({ metrics }: { metrics: StudentMetrics }) {
  const s = statusFromPercent(metrics.attendancePercent)
  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }} 
       animate={{ opacity: 1, y: 0 }} 
       transition={{ duration: 0.5, delay: 0.1 }}
       className="mt-8 bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/10 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Status Indicator Area */}
        <div className="flex items-center gap-6 w-full xl:w-auto">
          <div 
             className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500" 
             style={{ 
               background: `linear-gradient(135deg, ${s.color}20, transparent)`, 
               borderColor: `${s.color}40`,
               boxShadow: `inset 0 0 20px ${s.color}10`
             }}
          >
            <div className="text-5xl md:text-6xl drop-shadow-lg">{s.emoji}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold tracking-wide text-[var(--text-secondary)] uppercase">Academic Standing</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${s.textClass}`}>{s.label}</h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mt-2 font-medium max-w-xs">
              You are currently <strong className={`capitalize ${s.textClass}`}>{s.label}</strong>. Keep pushing to improve your metrics!
            </p>
          </div>
        </div>

        {/* Progress Rings */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 bg-[var(--bg-primary)]/50 p-6 rounded-2xl border border-[var(--border-color)]/30 w-full xl:w-auto">
          <ProgressRing percentage={metrics.attendancePercent} label="Attendance" />
          <ProgressRing percentage={metrics.academicScore} label="Academic" color="#8b5cf6" />
          <ProgressRing percentage={metrics.feeStatusPercent} label="Fees" color="#06b6d4" />
        </div>

        {/* Points & Tips */}
        <div className="flex flex-col items-center xl:items-end gap-6 w-full xl:w-auto">
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-5 py-3 rounded-xl shadow-inner">
            <div className="bg-amber-500/20 p-2 rounded-lg"><Award className="w-6 h-6 text-amber-500" /></div>
            <div>
              <div className="text-xs font-bold text-amber-500/80 uppercase tracking-widest">Reward Points</div>
              <div className="text-2xl font-black text-amber-400">{metrics.points}</div>
            </div>
          </div>
          <div className="w-full sm:w-80 bg-[var(--bg-primary)]/40 rounded-xl overflow-hidden border border-[var(--border-color)]/20">
            <TipsCarousel tips={metrics.tips} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
