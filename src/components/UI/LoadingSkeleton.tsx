// src/components/student/LoadingSkeleton.tsx
'use client'
export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="flex items-center gap-6">
        <div className="rounded-full bg-slate-700 w-36 h-36" />
        <div className="flex-1 space-y-2">
          <div className="w-2/3 h-6 bg-slate-700 rounded" />
          <div className="w-1/2 h-4 bg-slate-700 rounded" />
          <div className="w-1/4 h-4 bg-slate-700 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded bg-slate-700 h-28" />
        ))}
      </div>
    </div>
  )
}
