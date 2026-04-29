import React from 'react'
import { motion, Variants } from 'framer-motion'
import ProgressRing from '../../students/ProgressRing'
import { Sparkles } from 'lucide-react'

export default function TeacherStatsOverview() {
  const stats = [
    { label: 'Avg Attendance', value: 87, color: '#10B981', gradient: 'from-emerald-500/10 to-transparent', suffix: '%' },
    { label: 'Classes Today', value: 4, color: '#6366f1', gradient: 'from-indigo-500/10 to-transparent', suffix: '' },
    { label: 'Active Students', value: 120, color: '#f59e0b', gradient: 'from-amber-500/10 to-transparent', suffix: '' }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.section
      id="stats"
      className="py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
           <Sparkles className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
           <h3 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Today's Overview</h3>
           <p className="text-[var(--text-secondary)] mt-1 font-medium">Quick insights into your schedule, classes, and student engagement.</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((s) => (
          <motion.div 
             key={s.label} 
             variants={cardVariants}
             whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
             className={`bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 p-6 sm:p-8 rounded-3xl flex items-center gap-6 shadow-xl shadow-black/5 relative overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <ProgressRing progress={s.suffix === '%' ? s.value : Math.min((s.value / 150) * 100, 100)} color={s.color} radius={48} stroke={8} />
            </div>
            <div className="relative z-10">
              <h4 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">{s.label}</h4>
              <div className="text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight" style={{ color: s.color }}>
                {s.value}{s.suffix}
              </div>
              <div className="inline-flex items-center text-xs font-semibold px-2 py-0.5 mt-2 rounded-full bg-[var(--bg-primary)]/50 border border-[var(--border-color)]/30 text-[var(--text-secondary)] group-hover:border-transparent transition-colors">
                 Updated just now
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
