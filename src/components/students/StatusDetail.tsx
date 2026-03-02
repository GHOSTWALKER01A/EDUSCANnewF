// src/components/student/StatusDetail.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { StudentMetrics } from '../../types/metrics'
import { motion } from 'framer-motion'

export default function StatusDetail({ metrics, onChecklistChange }:
   { metrics: StudentMetrics, onChecklistChange?: (items: any[]) => void }) {
    console.log(metrics)
  const [items, setItems] = useState(metrics.checklist || [])

  useEffect(() => setItems(metrics.checklist || []), [metrics.checklist])

  function toggle(id: string) {
    const updated = items.map(i => i.id === id ? { ...i, done: !i.done } : i)
    setItems(updated)
    onChecklistChange?.(updated)
    // optionally persist: api.post('/student/checklist', updated)
  }

  const c = metrics.contribution
  const total = c.attendance + c.backlogs + c.fees || 1
  return (
    <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[0_8px_20px_var(--shadow)]">
      <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">My Status Details</h3>

      <div className="mb-4">
        <div className="text-sm text-[var(--text-secondary)]">Risk</div>
        <div className="text-base font-semibold mt-1 text-red-500">{metrics.risk.toUpperCase()}: {metrics.riskExplanation}</div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-[var(--text-secondary)]">Contribution</div>
        <div className="w-full bg-white/5 rounded-full h-6 overflow-hidden mt-2 flex">
          <div style={{ width: `${(c.attendance/total)*100}%` }} className="bg-[var(--accent)] h-6" title={`Attendance ${c.attendance}%`} />
          <div style={{ width: `${(c.backlogs/total)*100}%` }} className="bg-yellow-500 h-6" title={`Backlogs ${c.backlogs}%`} />
          <div style={{ width: `${(c.fees/total)*100}%` }} className="bg-blue-400 h-6" title={`Fees ${c.fees}%`} />
        </div>
        <div className="flex gap-3 mt-2 text-sm text-[var(--text-secondary)]">
          <div><span className="inline-block w-3 h-3 bg-[var(--accent)] mr-2 rounded" /> Attendance {c.attendance}%</div>
          <div><span className="inline-block w-3 h-3 bg-yellow-500 mr-2 rounded" /> Backlogs {c.backlogs}%</div>
          <div><span className="inline-block w-3 h-3 bg-blue-400 mr-2 rounded" /> Fees {c.fees}%</div>
        </div>
      </div>

      <div>
        <div className="text-sm text-[var(--text-secondary)] mb-2">What I need to do</div>
        <ul className="space-y-2">
          {items.map(it => (
            <li key={it.id} className="flex items-start gap-3">
              <input id={`cb-${it.id}`} type="checkbox" checked={it.done} onChange={() => toggle(it.id)} className="mt-1" />
              <label htmlFor={`cb-${it.id}`} className={`select-none ${it.done ? 'line-through text-white/60' : ''}`}>{it.text}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
