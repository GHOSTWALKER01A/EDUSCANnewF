
'use client'
import React from 'react'
import { DueItem } from '../../types/metrics'
import { motion } from 'framer-motion'
import{ format} from 'date-fns/format'

export default function FeesSection({ due }: { due: DueItem[] }) {
  const pending = due.filter(d => !d.paid).reduce((s, d) => s + d.amount, 0)
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card-bg)] p-6 rounded-xl shadow-[0_8px_20px_var(--shadow)]">
      <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">My Fees</h3>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-[var(--text-secondary)]">Pending Amount</div>
          <div className="text-2xl font-bold text-red-500">₹ {pending.toLocaleString()}</div>
        </div>
        <div>
          <button className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">Pay Now</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-[var(--text-secondary)]">Upcoming due dates</div>
        <ul className="mt-2 space-y-2">
          {due.map(d => (
            <li key={d.id} className="flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded">
              <div>
                <div className="font-semibold">{d.description}</div>
                <div className="text-sm text-[var(--text-secondary)]">Due {format(new Date(d.dueDate), 'PPP')}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${d.paid ? 'text-green-400' : 'text-red-400'}`}>₹ {d.amount}</div>
                {!d.paid && <div className="text-xs text-[var(--text-secondary)]">Pay before due date</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
