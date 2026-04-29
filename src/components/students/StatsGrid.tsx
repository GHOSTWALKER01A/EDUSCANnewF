// src/components/student/StatsGrid.tsx
'use client'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { CalendarClock, FileSpreadsheet, GraduationCap, Radar } from 'lucide-react'

type Props = {
  upcomingCount: number
  assignmentsCount: number
  avgGrade: number | string
  attendanceRate: number
  onAssignmentsClick: () => void
  onGradesClick: () => void
  onAttendanceClick: () => void
}

export default function StatsGrid({ upcomingCount, assignmentsCount, avgGrade, attendanceRate, onAssignmentsClick, onGradesClick, onAttendanceClick }: Props) {
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  const percentage = attendanceRate;
  
  return (
    <motion.div 
       variants={containerVariants}
       initial="hidden"
       animate="visible"
       className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {/* Upcoming Classes Card */}
      <motion.div variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110"><CalendarClock className="w-16 h-16 text-emerald-500" /></div>
        <div className="relative z-10">
           <div className="bg-emerald-500/10 w-fit p-2.5 rounded-xl border border-emerald-500/20 mb-4"><CalendarClock className="w-5 h-5 text-emerald-500" /></div>
           <h3 className="text-sm text-[var(--text-secondary)] font-medium tracking-wide uppercase">Upcoming Classes</h3>
           <div className="mt-2 flex items-baseline gap-2">
             <span className="text-3xl font-extrabold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">{upcomingCount}</span>
             <span className="text-sm font-medium text-[var(--text-secondary)]">today</span>
           </div>
        </div>
      </motion.div>

      {/* Assignments Card */}
      <motion.div variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }} onClick={onAssignmentsClick} className="group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 rounded-2xl shadow-xl shadow-black/5 cursor-pointer overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110"><FileSpreadsheet className="w-16 h-16 text-indigo-500" /></div>
        <div className="relative z-10">
           <div className="bg-indigo-500/10 w-fit p-2.5 rounded-xl border border-indigo-500/20 mb-4"><FileSpreadsheet className="w-5 h-5 text-indigo-500" /></div>
           <h3 className="text-sm text-[var(--text-secondary)] font-medium tracking-wide uppercase">Assignments</h3>
           <div className="mt-2 flex items-baseline gap-2">
             <span className="text-3xl font-extrabold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">{assignmentsCount}</span>
             <span className="text-sm font-medium text-[var(--text-secondary)]">active</span>
           </div>
        </div>
      </motion.div>

      {/* Grades Card */}
      <motion.div variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }} onClick={onGradesClick} className="group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110"><GraduationCap className="w-16 h-16 text-amber-500" /></div>
        <div className="relative z-10">
           <div className="bg-amber-500/10 w-fit p-2.5 rounded-xl border border-amber-500/20 mb-4"><GraduationCap className="w-5 h-5 text-amber-500" /></div>
           <h3 className="text-sm text-[var(--text-secondary)] font-medium tracking-wide uppercase">Grades Overview</h3>
           <div className="mt-2 flex items-baseline gap-2">
             <span className="text-3xl font-extrabold text-[var(--text-primary)] group-hover:text-amber-400 transition-colors">{avgGrade}</span>
             <span className="text-sm font-medium text-[var(--text-secondary)]">CGPA</span>
           </div>
           <button  className="mt-3 text-xs font-semibold text-[var(--accent)] hover:text-indigo-400 transition-colors flex items-center gap-1 group/btn">
             View details <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
           </button>
        </div>
      </motion.div>

      {/* Attendance Rate Card */}
      <motion.div variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 } }} onClick={onAttendanceClick} className="group relative bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 rounded-2xl shadow-xl shadow-black/5 cursor-pointer overflow-hidden transition-all duration-300 hover:border-rose-500/40 hover:shadow-rose-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110"><Radar className="w-16 h-16 text-rose-500" /></div>
        <div className="relative z-10 w-full">
           <div className="bg-rose-500/10 w-fit p-2.5 rounded-xl border border-rose-500/20 mb-4"><Radar className="w-5 h-5 text-rose-500" /></div>
           <h3 className="text-sm text-[var(--text-secondary)] font-medium tracking-wide uppercase">Attendance Overview</h3>
           <div className="mt-2 flex items-baseline gap-2">
             <span className="text-3xl font-extrabold text-[var(--text-primary)] group-hover:text-rose-400 transition-colors">{percentage}%</span>
             <span className="text-sm font-medium text-[var(--text-secondary)]">done</span>
           </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
