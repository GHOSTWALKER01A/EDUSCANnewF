
'use client'
import React from 'react'
import { Resource } from '../../../types/resource.type'
import { format } from 'date-fns'

export default function ResourceCard({ resource, onOpen }: { resource: Resource; onOpen: (r: Resource) => void }) {
  return (
    <article className="bg-[var(--bg-secondary)] p-4 rounded shadow hover:shadow-md transition">
      <h4 className="text-[var(--accent)] font-semibold mb-1">{resource.title}</h4>
      <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-3">{resource.description}</p>
      <div className="flex items-center justify-between text-xs">
        <div className="text-[var(--text-secondary)]">By {resource.uploadedBy?.fullname || 'Unknown'}</div>
        <div className="text-[var(--text-secondary)]">{format(new Date(resource.createdAt), 'PPP')}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onOpen(resource)} className="px-3 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">View</button>
        <a href={resource.fileUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded border">Download</a>
      </div>
    </article>
  )
}
