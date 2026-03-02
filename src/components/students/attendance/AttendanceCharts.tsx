

'use client'
import React from 'react'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AttendanceCharts({ series }: { series: { date: string; value: number }[] }) {
  if (!series || series.length === 0) return <div>No chart data</div>

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={series}>
        <XAxis dataKey="date" />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
