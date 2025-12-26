
'use client'
import React from 'react'
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { SeriesPoint } from '../../types/metrics'

export default function GradesChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="bg-[var(--card-bg)] p-4 rounded-xl shadow-[0_8px_20px_var(--shadow)]">
      <h4 className="text-md font-semibold text-[var(--accent)] mb-2">Grades progression</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)"/>
            <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)' }} />
            <Tooltip wrapperStyle={{ background: '#0a2239', borderRadius: 8 }} />
            <Bar dataKey="value" barSize={20} fill="#7C3AED" />
            <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
