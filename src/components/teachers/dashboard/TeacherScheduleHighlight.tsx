import React from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TeacherScheduleHighlight() {
  const nextClass = {
    subject: "Data Structures",
    time: "10:30 AM",
    room: "Lab 402",
    status: "Upcoming"
  }

  const color = 'text-indigo-500'
  const bg = 'bg-indigo-500'
  const bgLight = 'bg-indigo-500/10'
  const border = 'border-indigo-500/30'
  const shadow = 'shadow-[0_0_30px_rgba(99,102,241,0.2)]'

  return (
    <motion.section
      id="schedule-highlight"
      className="py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8 }}
    >
      <div className={`bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-[var(--border-color)]/50 transition-colors`}>
        
        {/* Dynamic Glow Behind Everything */}
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full blur-[80px] pointer-events-none transform -translate-x-1/2 opacity-30 ${bg}`} />

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          
          {/* Circular Timeline Badge */}
          <div className="shrink-0 relative group-hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-[-4px] rounded-full border border-dashed border-[var(--border-color)]/30 animate-[spin_12s_linear_infinite]" />
             <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center ${bgLight} border ${border} ${shadow} backdrop-blur-md`}>
                <CalendarClock className={`w-8 h-8 mb-2 ${color} opacity-80`} />
                <div className={`text-4xl md:text-5xl font-black ${color} tracking-tighter`}>
                  {nextClass.time}
                </div>
                <div className="text-sm font-bold tracking-widest uppercase mt-1 opacity-70">Next Class</div>
             </div>
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <h3 className="text-3xl font-bold text-[var(--accent)] tracking-tight">{nextClass.subject}</h3>
            <p className="text-[var(--text-secondary)] mt-3 leading-relaxed max-w-2xl font-medium text-lg">
               You are scheduled to teach {nextClass.subject} in {nextClass.room} at {nextClass.time}. Ensure you have your materials prepared.
            </p>

            <div className="mt-8 max-w-xl flex flex-col sm:flex-row gap-4">
              <Link href="/teacher/dashboard/teacherattendance" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold tracking-wide shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                 Take Attendance
              </Link>
              <Link href="/teacher/dashboard/teacherschedule" className="flex-1 px-6 py-3 rounded-xl bg-[var(--bg-primary)]/50 text-[var(--text-primary)] border border-[var(--border-color)]/30 font-bold tracking-wide hover:bg-[var(--bg-primary)] transition-colors flex items-center justify-center gap-2">
                 View Full Schedule <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </div>

        </div>
      </div>
    </motion.section>
  )
}
