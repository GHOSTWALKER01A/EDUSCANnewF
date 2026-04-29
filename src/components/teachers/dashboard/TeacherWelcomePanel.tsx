import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

type Props = { userName: string }

export default function TeacherWelcomePanel({ userName }: Props) {
  return (
    <motion.section
      id="welcome"
      className="relative pt-16 md:pt-24 pb-12 z-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2, duration: 0.8 }}
               className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full text-sm font-semibold mb-6"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Instructor Portal
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent)] to-indigo-500 tracking-tight leading-tight">
              Hello, {userName}
            </h2>
            <p className="mt-6 text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome back to your command center. Get a quick snapshot of class attendance, upcoming schedules, and manage student records efficiently.
            </p>
          </div>

          {/* Video / Highlight Panel */}
          <div className="flex-1 w-full lg:w-auto">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
               className="bg-[var(--card-bg)]/60 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[var(--accent)]/10 p-2"
            >
              <div className="rounded-2xl overflow-hidden border border-[var(--border-color)]/20 relative group">
                {/* Decorative overlay on video */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                <video 
                  src="/college.mp4" 
                  autoPlay 
                  muted 
                  playsInline 
                  loop 
                  className="w-full h-[300px] md:h-[400px] object-cover scale-105 group-hover:scale-100 transition-transform duration-700" 
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  )
}
