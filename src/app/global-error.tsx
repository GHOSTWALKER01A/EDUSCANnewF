'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'

// This boundary handles errors in the root layout.tsx and any uncaught errors that bubble up
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg-primary)] flex h-screen flex-col items-center justify-center p-4 antialiased">
        <div className="w-full max-w-md rounded-xl bg-[var(--card-bg)] p-8 text-center shadow-[0_20px_50px_rgba(2,6,23,0.5)] border border-red-500/20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle className="h-8 w-8" strokeWidth={2} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[var(--accent)]">Critical Application Error</h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            A fatal error occurred that requires the application to restart. We apologize for the inconvenience.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)] transition hover:scale-105"
            >
              Try to recover
            </button>
            <button
               // Hard refresh
              onClick={() => window.location.reload()}
              className="w-full rounded-full border border-[var(--border-color)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--hover-bg)]"
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
