
'use client'
import React from 'react'
import type { AttendanceRow } from '../../../types/attendance'

export default function AttendanceTable({
  rows,
  onRowClick,
  onLoadMore,
  hasMore,
}: {
  rows: AttendanceRow[]
  onRowClick?: (row: AttendanceRow) => void
  onLoadMore?: () => void
  hasMore?: boolean
}) {
  return (
    <div className="bg-[var(--card-bg)] rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Date</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t last:border-b hover:bg-[rgba(0,0,0,0.02)] cursor-pointer" onClick={() => onRowClick?.(r)}>
                <td className="py-3">{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.subject}</td>
                <td>{r.time ?? '-'}</td>
                <td>{r.room ?? '-'}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    r.status === 'Present' ? 'bg-green-100 text-green-700' :
                    r.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                    r.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button onClick={onLoadMore} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Load more</button>
        </div>
      )}
    </div>
  )
}
