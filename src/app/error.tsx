'use client'

import React, { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertCircle } from 'lucide-react'

// Segment error boundary
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry automatically
    console.error('Captured by Error Boundary:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-sm rounded-xl bg-[var(--card-bg)] p-6 shadow-xl border border-[var(--border-color)]">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
           <AlertCircle className="h-6 w-6" strokeWidth={2} />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">Something went wrong!</h2>
        <p className="mb-5 text-sm text-[var(--text-secondary)]">
           An unexpected error occurred in this section of the app.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--bg-primary)] transition hover:scale-105"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
