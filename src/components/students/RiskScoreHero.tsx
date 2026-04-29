import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, FileWarning, ShieldCheck } from 'lucide-react'
import { useMetrics } from '../../hooks/useMetrics'

export default function RiskScore() {
  const { metrics } = useMetrics()
  const risk = Math.max(0, 100 - (metrics?.attendancePercent ?? 100))
  
  const getRiskAesthetics = () => {
    if (risk >= 75) return { 
       color: 'text-rose-500', 
       bg: 'bg-rose-500',
       bgLight: 'bg-rose-500/10',
       border: 'border-rose-500/30',
       shadow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
       message: 'High Risk: Action Required to Improve Attendance',
       Icon: AlertCircle
    }
    if (risk >= 50) return { 
       color: 'text-amber-500', 
       bg: 'bg-amber-500',
       bgLight: 'bg-amber-500/10',
       border: 'border-amber-500/30',
       shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
       message: 'Moderate Risk: Please Monitor Your Status',
       Icon: FileWarning
    }
    return { 
       color: 'text-emerald-500', 
       bg: 'bg-emerald-500',
       bgLight: 'bg-emerald-500/10',
       border: 'border-emerald-500/30',
       shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
       message: 'Low Risk: Keep Up the Good Work!',
       Icon: ShieldCheck
    }
  }

  const { color, bg, bgLight, border, shadow, message, Icon } = getRiskAesthetics()

  return (
    <motion.section
      id="risk"
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
          
          {/* Circular Score Badge */}
          <div className="shrink-0 relative group-hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-[-4px] rounded-full border border-dashed border-[var(--border-color)]/30 animate-[spin_12s_linear_infinite]" />
             <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex flex-col items-center justify-center ${bgLight} border ${border} ${shadow} backdrop-blur-md`}>
                <Icon className={`w-8 h-8 mb-2 ${color} opacity-80`} />
                <div className={`text-5xl md:text-6xl font-black ${color} tracking-tighter`}>
                  {risk}<span className="text-3xl opacity-80">%</span>
                </div>
                <div className="text-sm font-bold tracking-widest uppercase mt-1 opacity-70">Risk Level</div>
             </div>
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <h3 className="text-3xl font-bold text-[var(--accent)] tracking-tight">Risk Analysis</h3>
            <p className="text-[var(--text-secondary)] mt-3 leading-relaxed max-w-2xl font-medium text-lg">
               {message}
            </p>

            <div className="mt-8 max-w-xl">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-sm font-bold tracking-wider uppercase text-[var(--text-primary)]">Factor: Attendance</span>
                 <span className={`text-sm font-bold ${color}`}>{risk}/100</span>
              </div>
              <div className="h-4 bg-[var(--bg-primary)] border border-[var(--border-color)]/20 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: `${risk}%` }}
                   transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                   viewport={{ once: true }}
                   className={`h-full ${bg} relative`} 
                >
                   <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                </motion.div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-3 opacity-80">
                Your attendance contribution is the largest factor in determining your risk score. Log in daily to reduce it.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  )
}
