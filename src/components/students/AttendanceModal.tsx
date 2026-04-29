import React from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X, Radar, TrendingUp, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react'

import { useSubjectAttendance, SubjectAttendanceData } from '../../hooks/useAttendance'

interface AttendanceModalProps {
  open: boolean
  onClose: () => void
}

export default function AttendanceModal({ open, onClose }: AttendanceModalProps) {
  const { data: subjects = [], isLoading } = useSubjectAttendance()

  if (!open) return null

  const calculateNeeded = (present: number, total: number) => {
    return Math.max(0, 3 * total - 4 * present);
  }

  const overallPresent = subjects.reduce((sum, s) => sum + s.present, 0)
  const overallTotal = subjects.reduce((sum, s) => sum + s.total, 0)
  const overallPercentage = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0
  const overallNeeded = calculateNeeded(overallPresent, overallTotal)

  const subjectVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:mt-0 mt-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-2xl bg-[var(--card-bg)]/95 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]/20 bg-gradient-to-r from-rose-500/10 via-[var(--card-bg)] to-[var(--card-bg)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <Radar className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                    Attendance Overview
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">
                    Subject-wise breakdown & criteria tracking
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Overall Summary Card */}
              <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] border border-[var(--border-color)]/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="text-center sm:text-left">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Overall Rate</h3>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2">
                      <span className="text-5xl font-extrabold text-[var(--text-primary)]">{overallPercentage}</span>
                      <span className="text-xl font-bold text-[var(--text-secondary)]">%</span>
                    </div>
                    <p className="text-sm font-semibold mt-2 text-rose-400">
                      {overallPresent} / {overallTotal} Classes
                    </p>
                  </div>
                  
                  <div className={`p-5 rounded-2xl border ${overallPercentage >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} max-w-[280px]`}>
                    <div className="flex items-start gap-3">
                      {overallPercentage >= 75 ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`text-sm font-bold ${overallPercentage >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {overallPercentage >= 75 ? "Criteria Met!" : "Attention Needed"}
                        </h4>
                        <p className="text-xs font-medium text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                          {overallPercentage >= 75 
                            ? "You are maintaining the 75% attendance criteria. Keep it up!"
                            : `You need to attend ${overallNeeded} more classes consecutively to achieve the 75% criteria.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-wide uppercase flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--text-secondary)]" /> Subject Breakdown
                </h3>
                {isLoading ? (
                  <div className="text-center py-8">
                     <div className="w-8 h-8 border-4 border-[var(--border-color)] border-t-rose-500 rounded-full animate-spin mx-auto"></div>
                     <p className="mt-4 text-[var(--text-secondary)] text-sm font-medium">Loading attendance data...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {subjects.map((subject, idx) => {
                      const percentage = subject.total > 0 ? Math.round((subject.present / subject.total) * 100) : 0;
                      const needed = calculateNeeded(subject.present, subject.total);
                      const isLow = percentage < 75;

                      return (
                        <motion.div 
                          initial="hidden" 
                          animate="visible" 
                          variants={subjectVariants}
                          transition={{ delay: idx * 0.05 }}
                          key={idx} 
                          className="bg-[var(--bg-primary)] border border-[var(--border-color)]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-center transition-all hover:border-[var(--border-color)]/50 hover:shadow-lg hover:shadow-black/5"
                        >
                          <div className="flex-1 w-full text-center sm:text-left">
                             <h4 className="font-bold text-[var(--text-primary)] text-base">{subject.subject}</h4>
                             <div className="flex flex-col sm:flex-row items-center sm:gap-4 mt-2">
                               <div className="flex items-center gap-2">
                                  <span className={`text-xl font-extrabold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {percentage}%
                                  </span>
                                  <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase bg-[var(--card-bg)] px-2 py-0.5 rounded-full border border-[var(--border-color)]/30">
                                    {subject.present}/{subject.total} Present
                                  </span>
                               </div>
                             </div>
                          </div>

                          {/* Progress and Tips */}
                          <div className="w-full sm:w-1/2 flex flex-col gap-2">
                             <div className="w-full bg-[var(--card-bg)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]/20">
                               <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${percentage}%` }} 
                                  transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                                  className={`h-full rounded-full bg-gradient-to-r ${isLow ? 'from-rose-500 to-rose-400' : 'from-emerald-500 to-emerald-400'}`} 
                               />
                             </div>
                             {isLow ? (
                               <div className="flex items-center gap-1.5 justify-end">
                                 <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                 <span className="text-[11px] font-medium text-rose-400">
                                   Attend {needed} more to reach 75%
                                 </span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-1.5 justify-end">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                 <span className="text-[11px] font-medium text-emerald-400">
                                   Criteria met
                                 </span>
                               </div>
                             )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
