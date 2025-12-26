
'use client'
import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { SeriesPoint } from '../../types/metrics'

export default function AttendanceChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-xl shadow-[0_8px_20px_var(--shadow)]">
      <h4 className="text-md font-semibold text-[var(--accent)] mb-2">Attendance trend</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="attGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#18A357" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#18A357" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
            <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }}/>
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)' }}/>
            <Tooltip wrapperStyle={{ background: '#0a2239', borderRadius: 8 }} />
            <Area type="monotone" dataKey="value" stroke="#18A357" fill="url(#attGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
