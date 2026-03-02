
'use client'
import React from 'react'
import type { AttendanceSummary } from '../../../types/attendance'
import { PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#2dd4bf', '#f59e0b', '#ef4444']

export default function AttendanceSummary({ summary }: { summary?: AttendanceSummary | null }) {
  if (!summary) return <div>Loading summary...</div>

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
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">
      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg text-center">
        <h3 className="text-lg font-semibold text-[var(--accent)]">Your Current Status</h3>
        <p className="text-2xl font-bold mt-2">{summary.attendanceRate}%</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Attendance Rate</p>
        <p className="mt-3 text-sm">Classes: <strong>{summary.classesAttended}</strong></p>
      </div>

      <div className="p-4 bg-[var(--card-bg)] rounded-lg">
        <PieChart width={200} height={160}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
            {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Late</p>
            <p className="font-semibold">{summary.lateArrivals}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Absences</p>
            <p className="font-semibold">{summary.absences}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total</p>
            <p className="font-semibold">{summary.totalClasses}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
