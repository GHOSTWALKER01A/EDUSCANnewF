
'use client'

import { motion } from 'framer-motion'
import React from 'react'
import clsx from 'clsx'

type ErrorModalProps = {
  open: boolean
  title?: string
  details?: string | Record<string, any>
  onClose: () => void
}

export default function ErrorModal({ open, title = 'Error', details, onClose }: ErrorModalProps) {
  if (!open) return null

  const prettyDetails =
    typeof details === 'string' ? details : JSON.stringify(details, null, 2)

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
    >
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black"
      />

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={clsx(
          'relative z-10 w-full max-w-2xl rounded-xl bg-white/95 p-6 shadow-2xl',
        )}
        role="document"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-700">
              {typeof details === 'string' ? details : 'The server returned the following details:'}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close error dialog"
            className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <pre className="mt-4 max-h-64 overflow-auto rounded-md bg-slate-50 p-3 text-xs text-slate-800">
          {prettyDetails}
        </pre>
      </motion.div>
    </div>
  )
}
