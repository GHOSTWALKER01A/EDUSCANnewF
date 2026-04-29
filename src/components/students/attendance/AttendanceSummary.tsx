'use client'
import React from 'react'
import type { AttendanceSummary } from '../../../types/attendance'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Activity, Clock, XCircle, CheckCircle2 } from 'lucide-react'

const COLORS = ['#34d399', '#f59e0b', '#ef4444']

export default function AttendanceSummaryComponent({ summary }: { summary?: AttendanceSummary | null }) {
  if (!summary) {
    return (
      <div className="w-full flex justify-center items-center py-12 opacity-50">
        <div className="w-10 h-10 border-4 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin"></div>
      </div>
    )
  }

  const attended = parseInt(summary.classesAttended.split('/')[0] || '0', 10)
  const total = summary.totalClasses || (attended + summary.absences)
  const absent = summary.absences
  const late = summary.lateArrivals

  const pieData = [
    { name: 'Attended', value: attended },
    { name: 'Late', value: late },
    { name: 'Absent', value: absent }
  ]

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full items-stretch">
      
      {/* Left: Premium Health Score Banner */}
      <div className="xl:flex-1 w-full relative overflow-hidden rounded-[2rem] p-8 sm:p-10 bg-gradient-to-r from-[var(--accent)]/10 to-indigo-500/10 border border-[var(--accent)]/20 shadow-inner group transition-all flex flex-col justify-center">
        <div className="absolute right-[-20px] top-[-20px] bg-[var(--accent)]/20 w-48 h-48 rounded-full blur-[50px] group-hover:bg-[var(--accent)]/30 transition-colors duration-700 pointer-events-none"></div>
        <div className="absolute left-[-20px] bottom-[-20px] bg-indigo-500/20 w-48 h-48 rounded-full blur-[50px] group-hover:bg-indigo-500/30 transition-colors duration-700 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent)]" /> Health Score
            </h3>
            <div className="flex items-baseline gap-2 group-hover:scale-105 transition-transform origin-left">
              <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[var(--text-secondary)] drop-shadow-sm tracking-tighter">{summary.attendanceRate}</span>
              <span className="text-2xl sm:text-3xl font-bold text-[var(--text-secondary)]">%</span>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2 sm:justify-end">
               Classes Attended
            </h3>
            <div className="flex items-baseline gap-2 justify-start sm:justify-end">
              <span className="text-4xl sm:text-5xl font-extrabold text-white shadow-sm">{attended}</span>
              <span className="text-sm font-bold text-[var(--text-secondary)]">/ {summary.totalClasses}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-8 sm:mt-10 w-full bg-[var(--bg-primary)]/50 rounded-full h-3 overflow-hidden border border-[var(--border-color)]/20 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-[var(--accent)] to-indigo-500 rounded-full shadow-[0_0_15px_var(--accent)]" 
            style={{ width: `${summary.attendanceRate}%` }} 
          />
        </div>
      </div>

      {/* Right: Chart & Detailed Stats */}
      <div className="xl:flex-1 w-full flex flex-col sm:flex-row items-center gap-8 justify-between bg-[var(--bg-primary)]/30 rounded-[2rem] p-6 border border-[var(--border-color)]/20 shadow-inner">
        
        {/* Pie Chart Centered */}
        <div className="flex justify-center relative flex-shrink-0 w-[200px] h-[200px]">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
               <span className="block text-3xl font-black text-white">{total}</span>
               <span className="block text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">Total</span>
             </div>
          </div>
          <PieChart width={200} height={200} className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            <Pie 
              data={pieData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              innerRadius={70}
              outerRadius={90} 
              stroke="none"
              paddingAngle={5}
              cornerRadius={8}
            >
              {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '1rem', fontWeight: 'bold' }}
              itemStyle={{ color: 'white' }}
            />
          </PieChart>
        </div>

        {/* Vertical Stat Cards */}
        <div className="flex flex-col gap-4 w-full sm:w-auto flex-grow justify-center">
          <div className="flex justify-between items-center px-5 py-4 rounded-2xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/20 backdrop-blur-sm hover:bg-[var(--bg-primary)]/70 group hover:border-emerald-500/30 transition-all cursor-default shadow-sm min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Attended</span>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors drop-shadow-md">{attended}</span>
          </div>

          <div className="flex justify-between items-center px-5 py-4 rounded-2xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/20 backdrop-blur-sm hover:bg-[var(--bg-primary)]/70 group hover:border-amber-500/30 transition-all cursor-default shadow-sm min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Late</span>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors drop-shadow-md">{late}</span>
          </div>

          <div className="flex justify-between items-center px-5 py-4 rounded-2xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/20 backdrop-blur-sm hover:bg-[var(--bg-primary)]/70 group hover:border-red-500/30 transition-all cursor-default shadow-sm min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Absences</span>
            </div>
            <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors drop-shadow-md">{absent}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
