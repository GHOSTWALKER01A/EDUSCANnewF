'use client'
import AttendanceChart from './AttendanceChart'
import GradesChart from './GradeChart'
import { SeriesPoint } from '../../types/metrics'
import { BarChart3 } from 'lucide-react'

export default function StatsSection({ attendanceSeries, gradesSeries }:
   { attendanceSeries: SeriesPoint[], gradesSeries: SeriesPoint[] }) {
  return (
    <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--border-color)]/30 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 mt-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]/20">
         <div className="bg-indigo-500/10 p-2 rounded-xl">
           <BarChart3 className="w-5 h-5 text-indigo-500" />
         </div>
         <h2 className="text-xl font-bold text-[var(--accent)]">Performance Analytics</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AttendanceChart data={attendanceSeries} />
        <GradesChart data={gradesSeries} />
      </div>
    </div>
  )
}
