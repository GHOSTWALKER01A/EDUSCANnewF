
'use client'
import React from 'react'

export default function AttendanceFilters({
  subject,
  setSubject,
  from,
  setFrom,
  to,
  setTo,
  onApply,
}: {
  subject: string
  setSubject: (s: string) => void
  from: string
  setFrom: (s: string) => void
  to: string
  setTo: (s: string) => void
  onApply?: () => void
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select className="p-2 border rounded" value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">All subjects</option>
        <option value="Math 101">Math 101</option>
        <option value="Science 102">Science 102</option>
        <option value="History 103">History 103</option>
        <option value="English 104">English 104</option>
      </select>

      <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="p-2 border rounded" />
      <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="p-2 border rounded" />

      <button onClick={onApply} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Apply</button>
    </div>
  )
}
