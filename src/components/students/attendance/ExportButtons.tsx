
'use client'
import React from 'react'
import type { AttendanceRow } from '../../../types/attendance'
import {toast} from 'react-toastify'
function toCSV(rows: AttendanceRow[]) {
  const header = ['Date','Subject','Time','Room','Status','Notes']
  const lines = rows.map(r => [
    new Date(r.date).toLocaleDateString(),
    r.subject.replace(/"/g,'""'),
    r.time ?? '',
    r.room ?? '',
    r.status,
    (r.notes ?? '').replace(/"/g,'""')
  ].map(cell => `"${cell}"`).join(','))
  return [header.join(','), ...lines].join('\n')
}

export default function ExportButtons({ rows }: { rows: AttendanceRow[] }) {
  const handleCSV = () => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${new Date().toISOString().slice(0,10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleCopyJSON = async () => {
    await navigator.clipboard.writeText(JSON.stringify(rows, null, 2))
    toast.success('Attendance copied to clipboard')
  }

  return (
    <div className="flex gap-3">
      <button onClick={handleCSV} className="px-3 py-2 rounded border">Export CSV</button>
      <button onClick={handleCopyJSON} className="px-3 py-2 rounded border">Copy</button>
    </div>
  )
}
